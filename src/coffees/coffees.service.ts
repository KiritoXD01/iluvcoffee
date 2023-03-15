import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeesRepository: Repository<Coffee>,
    ) {}

    async findAll(): Promise<Coffee[]> {
        return await this.coffeesRepository.find({
            relations: { flavors: true },
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
        const coffee = this.coffeesRepository.create(createCoffeeDto);
        return await this.coffeesRepository.save(coffee);
    }

    async update(
        id: number,
        updateCoffeeDto: UpdateCoffeeDto,
    ): Promise<Coffee> {
        const coffee = await this.coffeesRepository.preload({
            id,
            ...updateCoffeeDto,
        });
        if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
        return this.coffeesRepository.save(coffee);
    }

    async remove(id: number): Promise<void> {
        const coffee = await this.findOne(id);
        await this.coffeesRepository.remove(coffee);
    }
}
