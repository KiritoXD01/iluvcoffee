import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
    @Get()
    findAll() {
        return 'This action returns all coffees';
    }

    @Get('/flavors')
    findFlavors() {
        return 'This action returns all flavors';
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns #${id} coffee`;
    }

    @Post()
    create(@Body() body) {
        return body;
    }
}
