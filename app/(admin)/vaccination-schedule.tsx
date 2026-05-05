import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card, DangerButton, Field, PrimaryButton, SecondaryButton, Toggle } from '@/components';
import { formatAdminDate, getAdminHealthAppetiteLabel, getAdminHealthEnergyLabel, getAdminHealthStatusTone, getInitials, makeEuthanasiaForm, makeHealthForm, makeVaccineForm } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminHealthRecordPage() {
  const {
    store,
    activeAdminSection,
    setActiveAdminSection,
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
    selectedHealthItem,
    selectedHealthRecords,
    selectedHealthSchedules,
    selectedHealthLogs,
    selectedHealthLatestRecord,
    selectedHealthNextDueSchedule,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'health-record' ? (
              <Card title="Health Record" subtitle="Review one pet treatment record and update ongoing care.">
                {selectedHealthItem ? (
                  <View style={styles.adminHealthRecordPage}>
                    <Pressable style={styles.adminHealthRecordBackButton} onPress={() => setActiveAdminSection('health')}>
                      <Feather name="chevron-left" size={18} color={palette.ink} />
                      <Text style={styles.adminHealthRecordBackButtonText}>Back to health queue</Text>
                    </Pressable>

                    <View style={styles.adminHealthRecordHero}>
                      <View style={styles.adminHealthRecordHeroHeader}>
                        <View style={styles.adminHealthRecordHeroIdentity}>
                          <View
                            style={[
                              styles.adminHealthRecordHeroAvatar,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'danger' && styles.adminHealthAvatarDanger,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'warning' && styles.adminHealthAvatarWarning,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'success' && styles.adminHealthAvatarSuccess,
                            ]}
                          >
                            <Text style={styles.adminHealthRecordHeroAvatarText}>{getInitials(selectedHealthItem.pet.name)}</Text>
                          </View>
                          <View style={styles.adminHealthRecordHeroCopy}>
                            <Text style={styles.adminHealthRecordHeroName}>{selectedHealthItem.pet.name}</Text>
                            <Text style={styles.adminHealthRecordHeroMeta}>{selectedHealthItem.pet.breed} | {selectedHealthItem.pet.age}y | {selectedHealthItem.pet.gender}</Text>
                            <Text style={styles.adminHealthRecordHeroSubtext}>{selectedHealthItem.pet.id.toUpperCase()}</Text>
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
                    </View>

                    <View style={styles.adminHealthRecordTabRow}>
                      <Pressable style={[styles.adminHealthRecordTab, styles.adminHealthRecordTabActive]}>
                        <Text style={[styles.adminHealthRecordTabText, styles.adminHealthRecordTabTextActive]}>Overview</Text>
                      </Pressable>
                      <Pressable style={styles.adminHealthRecordTab}>
                        <Text style={styles.adminHealthRecordTabText}>History</Text>
                      </Pressable>
                      <Pressable style={styles.adminHealthRecordTab}>
                        <Text style={styles.adminHealthRecordTabText}>Medications</Text>
                      </Pressable>
                      <Pressable style={styles.adminHealthRecordTab}>
                        <Text style={styles.adminHealthRecordTabText}>Notes</Text>
                      </Pressable>
                    </View>

                    <View style={styles.adminHealthRecordSectionCard}>
                      <Text style={styles.adminHealthRecordSectionTitle}>Current Condition</Text>
                      <View style={styles.adminHealthRecordMetricList}>
                        <View style={styles.adminHealthRecordMetricRow}>
                          <Text style={styles.adminHealthRecordMetricLabel}>Diagnosis</Text>
                          <Text style={styles.adminHealthRecordMetricValue}>{selectedHealthLatestRecord?.diagnosis ?? 'No diagnosis yet'}</Text>
                        </View>
                        <View style={styles.adminHealthRecordMetricRow}>
                          <Text style={styles.adminHealthRecordMetricLabel}>Appetite</Text>
                          <Text style={styles.adminHealthRecordMetricValue}>{getAdminHealthAppetiteLabel(selectedHealthItem)}</Text>
                        </View>
                        <View style={styles.adminHealthRecordMetricRow}>
                          <Text style={styles.adminHealthRecordMetricLabel}>Energy Level</Text>
                          <Text style={styles.adminHealthRecordMetricValue}>{getAdminHealthEnergyLabel(selectedHealthItem)}</Text>
                        </View>
                        <View style={styles.adminHealthRecordMetricRow}>
                          <Text style={styles.adminHealthRecordMetricLabel}>Status</Text>
                          <Text
                            style={[
                              styles.adminHealthRecordMetricValue,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'danger' && styles.adminHealthRecordMetricValueDanger,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'warning' && styles.adminHealthRecordMetricValueWarning,
                              getAdminHealthStatusTone(selectedHealthItem.status) === 'success' && styles.adminHealthRecordMetricValueSuccess,
                            ]}
                          >
                            {selectedHealthItem.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.adminHealthRecordSectionCard}>
                      <Text style={styles.adminHealthRecordSectionTitle}>Diagnosis</Text>
                      <Text style={styles.adminHealthRecordDiagnosisTitle}>{selectedHealthLatestRecord?.diagnosis ?? selectedHealthItem.summary}</Text>
                      <Text style={styles.adminHealthRecordDiagnosisMeta}>
                        {selectedHealthLatestRecord
                          ? `${formatAdminDate(selectedHealthLatestRecord.reportedDate, { month: 'short', day: 'numeric', year: 'numeric' })} | ${selectedHealthLatestRecord.veterinarian}`
                          : 'No recent diagnosis on file'}
                      </Text>
                      <Text style={styles.adminHealthRecordBodyText}>{selectedHealthLatestRecord?.description ?? selectedHealthItem.note}</Text>
                    </View>

                    <View style={styles.adminHealthRecordSectionCard}>
                      <Text style={styles.adminHealthRecordSectionTitle}>Next Check-up</Text>
                      <Text style={styles.adminHealthRecordDiagnosisTitle}>
                        {selectedHealthNextDueSchedule
                          ? formatAdminDate(selectedHealthNextDueSchedule.nextDueDate, { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'No pending check-up'}
                      </Text>
                      <Text style={styles.adminHealthRecordDiagnosisMeta}>
                        {selectedHealthNextDueSchedule
                          ? `${selectedHealthNextDueSchedule.vaccineType} | ${selectedHealthNextDueSchedule.veterinarian ?? 'Shelter Vet'}`
                          : 'Vaccinations are up to date'}
                      </Text>
                      <Text style={styles.adminHealthRecordBodyText}>{selectedHealthNextDueSchedule?.notes ?? 'Schedule the next wellness follow-up if needed.'}</Text>
                    </View>

                    <View style={styles.adminHealthRecordSectionCard}>
                      <Text style={styles.adminHealthRecordSectionTitle}>Notes</Text>
                      <Text style={styles.adminHealthRecordBodyText}>{selectedHealthLatestRecord?.notes ?? selectedHealthItem.note}</Text>
                    </View>

                    <View style={styles.adminHealthRecordActionRow}>
                      <Pressable
                        style={styles.adminHealthRecordSecondaryButton}
                        onPress={() => {
                          if (selectedHealthLatestRecord) {
                            setHealthEditId(selectedHealthLatestRecord.id);
                            setHealthForm(makeHealthForm(selectedHealthLatestRecord));
                          } else {
                            setHealthEditId(null);
                            setHealthForm(makeHealthForm(undefined, selectedHealthItem.pet.id));
                          }
                        }}
                      >
                        <Feather name="edit-2" size={16} color={palette.clayDeep} />
                        <Text style={styles.adminHealthRecordSecondaryButtonText}>Edit Record</Text>
                      </Pressable>
                      <Pressable
                        style={styles.adminHealthRecordPrimaryButton}
                        onPress={() => setVaccineForm(makeVaccineForm(undefined, selectedHealthItem.pet.id))}
                      >
                        <Feather name="plus" size={16} color={palette.paper} />
                        <Text style={styles.adminHealthRecordPrimaryButtonText}>Add Check-up</Text>
                      </Pressable>
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
                            <Text style={styles.adminHealthMiniCardText}>{record.isCritical ? 'Critical alert' : 'Routine care'} | {record.reportedDate}</Text>
                          </Pressable>
                        ))}
                        {healthEditId ? <DangerButton label="Delete Alert" onPress={async () => {
                          await store.deleteHealthRecord(healthEditId);
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
                            <Text style={styles.adminHealthMiniCardText}>{log.euthanasiaDate} | {log.veterinarian}</Text>
                          </Pressable>
                        ))}
                        {euthanasiaEditId ? <DangerButton label="Delete Log" onPress={async () => {
                          await store.deleteEuthanasiaLog(euthanasiaEditId);
                          setEuthanasiaEditId(null);
                          setEuthanasiaForm(makeEuthanasiaForm(undefined, selectedHealthItem.pet.id));
                        }} /> : null}
                      </View>
                    </View>
                  </View>
                ) : null}
              </Card>
            ) : null}
    </>
  );
}

export default function AdminVaccinationScheduleRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="health-record" />;
}
