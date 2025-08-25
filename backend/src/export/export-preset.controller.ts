@Post('bulk-delete')
@Roles('Admin')
async bulkDelete(@Body() dto: { ids: number[] }, @Req() req) {
  // Permission checks for each id, ensure user can delete
  await this.presetRepo.delete(dto.ids);
  return { deleted: dto.ids };
}