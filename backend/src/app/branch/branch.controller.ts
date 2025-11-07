import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from '../../dto/branch.dto';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.branchService.findAll(query);
  }

  @Get('map/points')
  getMapPoints() {
    return this.branchService.getMapPoints();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Get(':id/details')
  findDetails(@Param('id') id: string) {
    return this.branchService.getBranchDetails(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
}
