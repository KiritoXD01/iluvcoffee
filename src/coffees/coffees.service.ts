import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { DataSource, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.contants';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeesRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorsRepository: Repository<Flavor>,
        private readonly dataSource: DataSource,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    ) {
        console.log(coffeeBrands);
    }

    async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
        const { limit, offset } = paginationQuery;
        return await this.coffeesRepository.find({
            relations: { flavors: true },
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: number): Promise<Coffee> {
        const coffee = await this.coffeesRepository.findOne({
            where: { id },
            relations: { flavors: true },
        });
        if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map((name) =>
                this.preloadFlavorByName(name),
            ),
        );
        const coffee = this.coffeesRepository.create({
            ...createCoffeeDto,
            flavors,
        });
        return await this.coffeesRepository.save(coffee);
    }

    async update(
        id: number,
        updateCoffeeDto: UpdateCoffeeDto,
    ): Promise<Coffee> {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map((name) =>
                    this.preloadFlavorByName(name),
                ),
            ));
        const coffee = await this.coffeesRepository.preload({
            id,
            ...updateCoffeeDto,
            flavors,
        });
        if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
        return this.coffeesRepository.save(coffee);
    }

    async remove(id: number): Promise<void> {
        const coffee = await this.findOne(id);
        await this.coffeesRepository.remove(coffee);
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorsRepository.findOne({
            where: { name },
        });
        if (existingFlavor) return existingFlavor;
        return this.flavorsRepository.create({ name });
    }

    async recommendCoffee(coffee: Coffee): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;
            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };
            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
