import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card, DangerButton, Field, PrimaryButton, SecondaryButton, Toggle } from '@/components';
import { formatAdminDate, getAdminHealthStatusTone, getInitials, makeEuthanasiaForm, makeHealthForm, makeVaccineForm } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminHealthPage() {
  const {
    store,
    activeAdminSection,
    adminHealthFilter,
    setAdminHealthFilter,
    adminHealthSearchTerm,
    setAdminHealthSearchTerm,
    healthForm,
    setHealthForm,
    healthEditId,
    setHealthEditId,
    vaccineForm,
    setVaccineForm,
    euthanasiaForm,
    setEuthanasiaForm,
    euthanasiaEditId,
    setEuthanasiaEditId,
    isTablet,
    adminFilteredHealthQueue,
    selectedHealthItem,
    selectedHealthRecords,
    selectedHealthSchedules,
    selectedHealthLogs,
    selectedHealthNextDueSchedule,
    adminHealthTabs,
    adminHealthMetrics,
    openAdminHealthRecord,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'health' ? (
              <Card title="Health Monitoring" subtitle="Treatments, recoveries, and due check-ups in one queue.">
                <View style={styles.adminHealthLayout}>
                  <View style={styles.adminHealthMetricGrid}>
                    {adminHealthMetrics.map((metric) => (
                      <View key={metric.key} style={[styles.adminHealthMetricCard, isTablet && styles.adminHealthMetricCardSplit]}>
                        <View style={[styles.adminHealthMetricIcon, { backgroundColor: metric.tint }]}>
                          <Feather name={metric.icon} size={16} color={metric.accent} />
                        </View>
                        <Text style={styles.adminHealthMetricLabel}>{metric.label}</Text>
                        <Text style={styles.adminHealthMetricValue}>{metric.value}</Text>
                        <Text style={styles.adminHealthMetricNote}>{metric.note}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.adminHealthSearchRow}>
                    <View style={styles.adminHealthSearchShell}>
                      <Feather name="search" size={16} color="#94a3b8" />
                      <TextInput
                        value={adminHealthSearchTerm}
                        onChangeText={setAdminHealthSearchTerm}
                        placeholder="Search health records..."
                        placeholderTextColor="#94a3b8"
                        style={styles.adminHealthSearchInput}
                      />
                    </View>
                    <View style={styles.adminHealthFilterIcon}>
                      <Feather name="sliders" size={16} color={palette.clayDeep} />
                    </View>
                  </View>

                  <View style={styles.adminHealthTabRow}>
                    {adminHealthTabs.map((tab) => (
                      <Pressable
                        key={tab.key}
                        style={[styles.adminHealthTab, adminHealthFilter === tab.key && styles.adminHealthTabActive]}
                        onPress={() => setAdminHealthFilter(tab.key)}
                      >
                        <Text style={[styles.adminHealthTabText, adminHealthFilter === tab.key && styles.adminHealthTabTextActive]}>
                          {tab.label} ({tab.count})
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <View style={styles.adminHealthContent}>
                    <View style={styles.adminHealthQueue}>
                      {adminFilteredHealthQueue.length === 0 ? (
                        <View style={styles.adminHealthEmptyState}>
                          <Text style={styles.adminHealthEmptyTitle}>No health cases found</Text>
                          <Text style={styles.adminHealthEmptyText}>Try a different filter or search term to review the rest of the queue.</Text>
                        </View>
                      ) : (
                        adminFilteredHealthQueue.map((item) => {
                          const statusTone = getAdminHealthStatusTone(item.status);

                          return (
                            <Pressable
                              key={item.pet.id}
                              style={[styles.adminHealthRow, selectedHealthItem?.pet.id === item.pet.id && styles.adminHealthRowActive]}
                              onPress={() => openAdminHealthRecord(item.pet.id)}
                            >
                              <View
                                style={[
                                  styles.adminHealthAvatar,
                                  statusTone === 'danger' && styles.adminHealthAvatarDanger,
                                  statusTone === 'warning' && styles.adminHealthAvatarWarning,
                                  statusTone === 'success' && styles.adminHealthAvatarSuccess,
                                ]}
                              >
                                <Text style={styles.adminHealthAvatarText}>{getInitials(item.pet.name)}</Text>
                              </View>
                              <View style={styles.adminHealthRowCopy}>
                                <Text style={styles.adminHealthRowName}>{item.pet.name}</Text>
                                <Text style={styles.adminHealthRowMeta}>{item.pet.breed} • {item.pet.age}y • {item.pet.gender}</Text>
                                <Text style={styles.adminHealthRowSummary}>{item.summary}</Text>
                              </View>
                              <View style={styles.adminHealthRowStatusBlock}>
                                <View
                                  style={[
                                    styles.adminHealthStatusPill,
                                    statusTone === 'danger' && styles.adminHealthStatusPillDanger,
                                    statusTone === 'warning' && styles.adminHealthStatusPillWarning,
                                    statusTone === 'success' && styles.adminHealthStatusPillSuccess,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.adminHealthStatusPillText,
                                      statusTone === 'danger' && styles.adminHealthStatusPillTextDanger,
                                      statusTone === 'warning' && styles.adminHealthStatusPillTextWarning,
                                      statusTone === 'success' && styles.adminHealthStatusPillTextSuccess,
                                    ]}
                                  >
                                    {item.status}
                                  </Text>
                                </View>
                                <Feather name="chevron-right" size={18} color="#94a3b8" />
                              </View>
                            </Pressable>
                          );
                        })
                      )}
                    </View>

                    {false ? (
                      <View style={[styles.adminHealthDetailCard, isTablet && styles.adminHealthDetailCardSplit]}>
                        <View style={styles.adminHealthDetailHeader}>
                          <View style={styles.adminHealthDetailIdentity}>
                            <View
                              style={[
                                styles.adminHealthDetailAvatar,
                                getAdminHealthStatusTone(selectedHealthItem.status) === 'danger' && styles.adminHealthAvatarDanger,
                                getAdminHealthStatusTone(selectedHealthItem.status) === 'warning' && styles.adminHealthAvatarWarning,
                                getAdminHealthStatusTone(selectedHealthItem.status) === 'success' && styles.adminHealthAvatarSuccess,
                              ]}
                            >
                              <Text style={styles.adminHealthAvatarText}>{getInitials(selectedHealthItem.pet.name)}</Text>
                            </View>
                            <View style={styles.adminHealthDetailIdentityCopy}>
                              <Text style={styles.adminHealthDetailName}>{selectedHealthItem.pet.name}</Text>
                              <Text style={styles.adminHealthDetailMeta}>{selectedHealthItem.pet.breed} • {selectedHealthItem.pet.species} • {selectedHealthItem.pet.gender}</Text>
                            </View>
                          </View>
                          <View
                            style={[
                              styles.adminHealthStatusPill,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'danger' && styles.adminHealthStatusPillDanger,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'warning' && styles.adminHealthStatusPillWarning,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'success' && styles.adminHealthStatusPillSuccess,
                            ]}
                          >
                            <Text
                              style={[
                                styles.adminHealthStatusPillText,
                                getAdminHealthStatusTone(selectedHealthItem.status) === 'danger' && styles.adminHealthStatusPillTextDanger,
                                getAdminHealthStatusTone(selectedHealthItem.status) === 'warning' && styles.adminHealthStatusPillTextWarning,
                                getAdminHealthStatusTone(selectedHealthItem.status) === 'success' && styles.adminHealthStatusPillTextSuccess,
                              ]}
                            >
                              {selectedHealthItem.status}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.adminHealthDetailInfoGrid}>
                          <View style={styles.adminHealthInfoCard}>
                            <Text style={styles.adminHealthInfoLabel}>Latest Diagnosis</Text>
                            <Text style={styles.adminHealthInfoValue}>{selectedHealthItem.latestRecord?.diagnosis ?? 'No diagnosis yet'}</Text>
                            <Text style={styles.adminHealthInfoText}>{selectedHealthItem.latestRecord?.veterinarian ?? 'Awaiting veterinarian assignment'}</Text>
                          </View>
                          <View style={styles.adminHealthInfoCard}>
                            <Text style={styles.adminHealthInfoLabel}>Next Check-up</Text>
                            <Text style={styles.adminHealthInfoValue}>
                              {selectedHealthNextDueSchedule ? formatAdminDate(selectedHealthNextDueSchedule!.nextDueDate, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No pending schedule'}
                            </Text>
                            <Text style={styles.adminHealthInfoText}>{selectedHealthNextDueSchedule?.vaccineType ?? 'Vaccinations are up to date'}</Text>
                          </View>
                          <View style={styles.adminHealthInfoCard}>
                            <Text style={styles.adminHealthInfoLabel}>Recovery Note</Text>
                            <Text style={styles.adminHealthInfoValue}>{selectedHealthItem.note}</Text>
                            <Text style={styles.adminHealthInfoText}>Shelter care summary</Text>
                          </View>
                        </View>

                        <View style={styles.adminHealthWorkspaceGrid}>
                          <View style={styles.adminHealthWorkspaceCard}>
                            <Text style={styles.adminHealthWorkspaceTitle}>Health Alert Editor</Text>
                            <Text style={styles.adminHealthWorkspaceText}>Create or update treatment alerts for the selected pet.</Text>
                            <Field label="Pet ID" value={healthForm.petId} onChangeText={(value) => setHealthForm((current) => ({ ...current, petId: value }))} />
                            <Field label="Diagnosis" value={healthForm.diagnosis} onChangeText={(value) => setHealthForm((current) => ({ ...current, diagnosis: value }))} />
                            <Field label="Description" value={healthForm.description} multiline onChangeText={(value) => setHealthForm((current) => ({ ...current, description: value }))} />
                            <Field label="Veterinarian" value={healthForm.veterinarian} onChangeText={(value) => setHealthForm((current) => ({ ...current, veterinarian: value }))} />
                            <Field label="Notes" value={healthForm.notes} multiline onChangeText={(value) => setHealthForm((current) => ({ ...current, notes: value }))} />
                            <Toggle label="Critical Alert" value={healthForm.isCritical} onPress={() => setHealthForm((current) => ({ ...current, isCritical: !current.isCritical }))} />
                            <PrimaryButton label={healthEditId ? 'Update Alert' : 'Create Alert'} onPress={async () => {
                              if (healthEditId) await store.updateHealthRecord(healthEditId, healthForm); else await store.addHealthRecord({ ...healthForm, petId: healthForm.petId || selectedHealthItem.pet.id });
                              setHealthEditId(null);
                              setHealthForm(makeHealthForm(undefined, selectedHealthItem.pet.id));
                            }} />
                            <SecondaryButton label={`Use ${selectedHealthItem.pet.name}`} onPress={() => {
                              setHealthEditId(null);
                              setHealthForm(makeHealthForm(undefined, selectedHealthItem.pet.id));
                            }} />
                            {selectedHealthRecords.map((record) => (
                              <Pressable key={record.id} style={styles.adminHealthMiniCard} onPress={() => {
                                setHealthEditId(record.id);
                                setHealthForm(makeHealthForm(record));
                              }}>
                                <Text style={styles.adminHealthMiniCardTitle}>{record.diagnosis}</Text>
                                <Text style={styles.adminHealthMiniCardText}>{record.isCritical ? 'Critical alert' : 'Routine care'} • {record.reportedDate}</Text>
                              </Pressable>
                            ))}
                            {healthEditId ? <DangerButton label="Delete Alert" onPress={async () => {
                              await store.deleteHealthRecord(healthEditId!);
                              setHealthEditId(null);
                              setHealthForm(makeHealthForm(undefined, selectedHealthItem.pet.id));
                            }} /> : null}
                          </View>

                          <View style={styles.adminHealthWorkspaceCard}>
                            <Text style={styles.adminHealthWorkspaceTitle}>Vaccination Schedule</Text>
                            <Text style={styles.adminHealthWorkspaceText}>Keep upcoming check-ups and completed vaccines in sync.</Text>
                            <Field label="Pet ID" value={vaccineForm.petId} onChangeText={(value) => setVaccineForm((current) => ({ ...current, petId: value }))} />
                            <Field label="Vaccine Type" value={vaccineForm.vaccineType} onChangeText={(value) => setVaccineForm((current) => ({ ...current, vaccineType: value }))} />
                            <Field label="Next Due Date" value={vaccineForm.nextDueDate} onChangeText={(value) => setVaccineForm((current) => ({ ...current, nextDueDate: value }))} />
                            <Field label="Last Given Date" value={vaccineForm.lastGivenDate} onChangeText={(value) => setVaccineForm((current) => ({ ...current, lastGivenDate: value }))} />
                            <Field label="Veterinarian" value={vaccineForm.veterinarian} onChangeText={(value) => setVaccineForm((current) => ({ ...current, veterinarian: value }))} />
                            <Field label="Notes" value={vaccineForm.notes} multiline onChangeText={(value) => setVaccineForm((current) => ({ ...current, notes: value }))} />
                            <PrimaryButton label="Create Schedule" onPress={async () => {
                              await store.addVaccineSchedule({ ...vaccineForm, petId: vaccineForm.petId || selectedHealthItem.pet.id });
                              setVaccineForm(makeVaccineForm(undefined, selectedHealthItem.pet.id));
                            }} />
                            <SecondaryButton label={`Schedule for ${selectedHealthItem.pet.name}`} onPress={() => setVaccineForm(makeVaccineForm(undefined, selectedHealthItem.pet.id))} />
                            {selectedHealthSchedules.map((schedule) => (
                              <View key={schedule.id} style={styles.adminHealthMiniCard}>
                                <Text style={styles.adminHealthMiniCardTitle}>{schedule.vaccineType}</Text>
                                <Text style={styles.adminHealthMiniCardText}>{schedule.isCompleted ? 'Completed' : `Due ${schedule.nextDueDate}`}</Text>
                                {!schedule.isCompleted ? <SecondaryButton label="Mark Complete" onPress={() => store.markVaccineComplete(schedule.id)} /> : null}
                                <DangerButton label="Delete Schedule" onPress={() => store.deleteVaccineSchedule(schedule.id)} />
                              </View>
                            ))}
                          </View>

                          <View style={styles.adminHealthWorkspaceCard}>
                            <Text style={styles.adminHealthWorkspaceTitle}>Euthanasia Archive</Text>
                            <Text style={styles.adminHealthWorkspaceText}>Maintain historical logs for sensitive end-of-life records.</Text>
                            <Field label="Pet ID" value={euthanasiaForm.petId} onChangeText={(value) => setEuthanasiaForm((current) => ({ ...current, petId: value }))} />
                            <Field label="Reason" value={euthanasiaForm.reason} onChangeText={(value) => setEuthanasiaForm((current) => ({ ...current, reason: value }))} />
                            <Field label="Date" value={euthanasiaForm.euthanasiaDate} onChangeText={(value) => setEuthanasiaForm((current) => ({ ...current, euthanasiaDate: value }))} />
                            <Field label="Veterinarian" value={euthanasiaForm.veterinarian} onChangeText={(value) => setEuthanasiaForm((current) => ({ ...current, veterinarian: value }))} />
                            <Field label="Notes" value={euthanasiaForm.notes} multiline onChangeText={(value) => setEuthanasiaForm((current) => ({ ...current, notes: value }))} />
                            <PrimaryButton label={euthanasiaEditId ? 'Update Log' : 'Create Log'} onPress={async () => {
                              if (euthanasiaEditId) await store.updateEuthanasiaLog(euthanasiaEditId, euthanasiaForm); else await store.addEuthanasiaLog({ ...euthanasiaForm, petId: euthanasiaForm.petId || selectedHealthItem.pet.id });
                              setEuthanasiaEditId(null);
                              setEuthanasiaForm(makeEuthanasiaForm(undefined, selectedHealthItem.pet.id));
                            }} />
                            <SecondaryButton label={`Log for ${selectedHealthItem.pet.name}`} onPress={() => {
                              setEuthanasiaEditId(null);
                              setEuthanasiaForm(makeEuthanasiaForm(undefined, selectedHealthItem.pet.id));
                            }} />
                            {selectedHealthLogs.map((log) => (
                              <Pressable key={log.id} style={styles.adminHealthMiniCard} onPress={() => {
                                setEuthanasiaEditId(log.id);
                                setEuthanasiaForm(makeEuthanasiaForm(log));
                              }}>
                                <Text style={styles.adminHealthMiniCardTitle}>{log.reason}</Text>
                                <Text style={styles.adminHealthMiniCardText}>{log.euthanasiaDate} • {log.veterinarian}</Text>
                              </Pressable>
                            ))}
                            {euthanasiaEditId ? <DangerButton label="Delete Log" onPress={async () => {
                              await store.deleteEuthanasiaLog(euthanasiaEditId!);
                              setEuthanasiaEditId(null);
                              setEuthanasiaForm(makeEuthanasiaForm(undefined, selectedHealthItem.pet.id));
                            }} /> : null}
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Card>
            ) : null}
    </>
  );
}

export default function AdminHealthMonitoringRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="health" />;
}
