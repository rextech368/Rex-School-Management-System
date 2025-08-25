@Get('usage-summary')
@Roles('Admin')
async usageSummary(@Query('start') start, @Query('end') end) {
  // Aggregate data from Exports and Audit tables
  // Return counts, top users, top presets, error stats
  // Example: SELECT preset_id, COUNT(*) as count FROM exports WHERE created_at BETWEEN start AND end GROUP BY preset_id
}