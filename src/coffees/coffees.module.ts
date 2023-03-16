import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { COFFEE_BRANDS } from './coffees.contants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeeBrandsFactory {
    create(): string[] {
        return ['buddy brew', 'nescafe'];
    }
}

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
    controllers: [CoffeesController],
    providers: [
        CoffeesService,
        CoffeeBrandsFactory,
        {
            provide: COFFEE_BRANDS,
            useFactory: async (): Promise<string[]> => {
                const coffeeBrands = await Promise.resolve([
                    'buddy brew',
                    'nescafe',
                ]);
                return coffeeBrands;
            },
            inject: [CoffeeBrandsFactory],
        },
    ],
    exports: [CoffeesService],
})
export class CoffeesModule {}
