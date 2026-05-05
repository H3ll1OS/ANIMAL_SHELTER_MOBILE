export const healthService = {
  records: '/health-records',
  record: (recordId: string) => `/health-records/${recordId}`,
  vaccines: '/vaccine-schedules',
  vaccine: (scheduleId: string) => `/vaccine-schedules/${scheduleId}`,
  completeVaccine: (scheduleId: string) => `/vaccine-schedules/${scheduleId}/complete`,
  euthanasiaLogs: '/euthanasia-logs',
  euthanasiaLog: (logId: string) => `/euthanasia-logs/${logId}`,
};
