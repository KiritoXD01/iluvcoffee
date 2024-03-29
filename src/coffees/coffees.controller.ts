import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService) {}

    @Get()
    findAll() {
        return this.coffeeService.findAll();
    }

    @Get('/flavors')
    findFlavors() {
        return 'This action returns all flavors';
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.coffeeService.findOne(id);
    }

    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        return this.coffeeService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeeService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeeService.remove(+id);
    }
}
