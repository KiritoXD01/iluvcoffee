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
    findOne(@Param('id') id: string) {
        return this.coffeeService.findOne(+id);
    }

    @Post()
    create(@Body() body) {
        return this.coffeeService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.coffeeService.update(+id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffeeService.remove(+id);
    }
}
