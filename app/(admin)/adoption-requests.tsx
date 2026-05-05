import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card } from '@/components';
import { formatAdminDate, getAdminAdoptionStatusLabel, getAdminAdoptionStatusTone, getInitials } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminAdoptionsPage() {
  const {
    store,
    activeAdminSection,
    setSelectedAdoptionId,
    adminAdoptionFilter,
    setAdminAdoptionFilter,
    isTablet,
    adminFilteredAdoptions,
    selectedAdoption,
    selectedAdoptionPet,
    selectedAdoptionApplicant,
    adminAdoptionTabs,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'adoptions' ? (
              <Card title="Adoption Requests" subtitle="Review applications in a cleaner queue.">
                <View style={[styles.adminAdoptionLayout, isTablet && styles.adminAdoptionLayoutSplit]}>
                  <View style={[styles.adminAdoptionQueue, isTablet && styles.adminAdoptionQueueSplit]}>
                    <View style={styles.adminAdoptionQueueHeader}>
                      <View style={styles.adminAdoptionQueueCopy}>
                        <Text style={styles.adminAdoptionQueueTitle}>Review Queue</Text>
                        <Text style={styles.adminAdoptionQueueText}>
                          {adminFilteredAdoptions.length} request{adminFilteredAdoptions.length === 1 ? '' : 's'} in view
                        </Text>
                      </View>
                      <View style={styles.adminAdoptionQueueIcon}>
                        <Feather name="sliders" size={16} color={palette.clayDeep} />
                      </View>
                    </View>

                    <View style={styles.adminAdoptionFilterRow}>
                      {adminAdoptionTabs.map((tab) => (
                        <Pressable
                          key={tab.key}
                          style={[styles.adminAdoptionFilterChip, adminAdoptionFilter === tab.key && styles.adminAdoptionFilterChipActive]}
                          onPress={() => setAdminAdoptionFilter(tab.key)}
                        >
                          <Text style={[styles.adminAdoptionFilterChipText, adminAdoptionFilter === tab.key && styles.adminAdoptionFilterChipTextActive]}>
                            {tab.label} ({tab.count})
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <View style={styles.adminAdoptionRequestList}>
                      {adminFilteredAdoptions.length === 0 ? (
                        <View style={styles.adminAdoptionEmptyState}>
                          <Text style={styles.adminAdoptionEmptyTitle}>No requests in this filter</Text>
                          <Text style={styles.adminAdoptionEmptyText}>Switch status tabs to review the rest of the adoption pipeline.</Text>
                        </View>
                      ) : (
                        adminFilteredAdoptions.map((adoption) => {
                          const pet = store.pets.find((item) => item.id === adoption.petId);
                          const statusTone = getAdminAdoptionStatusTone(adoption.status);
                          const statusLabel = getAdminAdoptionStatusLabel(adoption.status);

                          return (
                            <Pressable
                              key={adoption.id}
                              style={[styles.adminAdoptionRequestCard, selectedAdoption?.id === adoption.id && styles.adminAdoptionRequestCardActive]}
                              onPress={() => setSelectedAdoptionId(adoption.id)}
                            >
                              <View style={styles.adminAdoptionRequestHeader}>
                                <View style={styles.adminAdoptionApplicant}>
                                  <View
                                    style={[
                                      styles.adminAdoptionAvatar,
                                      statusTone === 'success' && styles.adminAdoptionAvatarSuccess,
                                      statusTone === 'danger' && styles.adminAdoptionAvatarDanger,
                                    ]}
                                  >
                                    <Text style={styles.adminAdoptionAvatarText}>{getInitials(adoption.fullName)}</Text>
                                  </View>
                                  <View style={styles.adminAdoptionApplicantCopy}>
                                    <Text style={styles.adminAdoptionApplicantName}>{adoption.fullName}</Text>
                                    <Text style={styles.adminAdoptionApplicantMeta}>
                                      {formatAdminDate(adoption.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                                      {'  •  '}
                                      {formatAdminDate(adoption.createdAt, { hour: 'numeric', minute: '2-digit' })}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={[
                                    styles.adminAdoptionStatusPill,
                                    statusTone === 'success' && styles.adminAdoptionStatusPillSuccess,
                                    statusTone === 'danger' && styles.adminAdoptionStatusPillDanger,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.adminAdoptionStatusPillText,
                                      statusTone === 'success' && styles.adminAdoptionStatusPillTextSuccess,
                                      statusTone === 'danger' && styles.adminAdoptionStatusPillTextDanger,
                                    ]}
                                  >
                                    {statusLabel}
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.adminAdoptionRequestBody}>
                                <Text style={styles.adminAdoptionFieldLabel}>Pet</Text>
                                <Text style={styles.adminAdoptionFieldValue}>
                                  {pet?.name ?? 'Unknown'} {pet ? `(${pet.breed})` : ''}
                                </Text>
                                <Text style={styles.adminAdoptionFieldLabel}>Message</Text>
                                <View style={styles.adminAdoptionMessagePreview}>
                                  <Text style={styles.adminAdoptionMessagePreviewText} numberOfLines={2}>
                                    {adoption.message}
                                  </Text>
                                  <Feather name="chevron-right" size={18} color="#94a3b8" />
                                </View>
                              </View>
                            </Pressable>
                          );
                        })
                      )}
                    </View>
                  </View>

                  {selectedAdoption ? (
                    <View style={[styles.adminAdoptionDetailCard, isTablet && styles.adminAdoptionDetailCardSplit]}>
                      <View style={styles.adminAdoptionDetailHeader}>
                        <View style={styles.adminAdoptionDetailIdentity}>
                          <View
                            style={[
                              styles.adminAdoptionDetailAvatar,
                              getAdminAdoptionStatusTone(selectedAdoption.status) === 'success' && styles.adminAdoptionAvatarSuccess,
                              getAdminAdoptionStatusTone(selectedAdoption.status) === 'danger' && styles.adminAdoptionAvatarDanger,
                            ]}
                          >
                            <Text style={styles.adminAdoptionAvatarText}>{getInitials(selectedAdoption.fullName)}</Text>
                          </View>
                          <View style={styles.adminAdoptionDetailIdentityCopy}>
                            <Text style={styles.adminAdoptionDetailName}>{selectedAdoption.fullName}</Text>
                            <Text style={styles.adminAdoptionDetailMeta}>
                              Submitted {formatAdminDate(selectedAdoption.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.adminAdoptionStatusPill,
                            getAdminAdoptionStatusTone(selectedAdoption.status) === 'success' && styles.adminAdoptionStatusPillSuccess,
                            getAdminAdoptionStatusTone(selectedAdoption.status) === 'danger' && styles.adminAdoptionStatusPillDanger,
                          ]}
                        >
                          <Text
                            style={[
                              styles.adminAdoptionStatusPillText,
                              getAdminAdoptionStatusTone(selectedAdoption.status) === 'success' && styles.adminAdoptionStatusPillTextSuccess,
                              getAdminAdoptionStatusTone(selectedAdoption.status) === 'danger' && styles.adminAdoptionStatusPillTextDanger,
                            ]}
                          >
                            {getAdminAdoptionStatusLabel(selectedAdoption.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.adminAdoptionDetailInfoGrid}>
                        <View style={styles.adminAdoptionInfoCard}>
                          <Text style={styles.adminAdoptionFieldLabel}>Pet</Text>
                          <Text style={styles.adminAdoptionInfoTitle}>{selectedAdoptionPet?.name ?? 'Unknown pet'}</Text>
                          <Text style={styles.adminAdoptionInfoText}>
                            {[selectedAdoptionPet?.breed, selectedAdoptionPet?.species].filter(Boolean).join(' • ') || 'Breed details unavailable'}
                          </Text>
                        </View>
                        <View style={styles.adminAdoptionInfoCard}>
                          <Text style={styles.adminAdoptionFieldLabel}>Contact</Text>
                          <Text style={styles.adminAdoptionInfoTitle}>{selectedAdoption.email}</Text>
                          <Text style={styles.adminAdoptionInfoText}>{selectedAdoption.phone}</Text>
                        </View>
                        <View style={styles.adminAdoptionInfoCard}>
                          <Text style={styles.adminAdoptionFieldLabel}>Address</Text>
                          <Text style={styles.adminAdoptionInfoTitle}>{selectedAdoptionApplicant?.address ?? 'Address not provided'}</Text>
                          <Text style={styles.adminAdoptionInfoText}>{selectedAdoptionApplicant?.dateOfBirth ? `DOB ${selectedAdoptionApplicant.dateOfBirth}` : 'Applicant profile available in account records'}</Text>
                        </View>
                        <View style={styles.adminAdoptionInfoCard}>
                          <Text style={styles.adminAdoptionFieldLabel}>Documents</Text>
                          <Text style={styles.adminAdoptionInfoTitle}>{selectedAdoption.documents.length} file{selectedAdoption.documents.length === 1 ? '' : 's'}</Text>
                          <Text style={styles.adminAdoptionInfoText}>{selectedAdoption.documents.join(', ') || 'No files attached'}</Text>
                        </View>
                      </View>

                      <View style={styles.adminAdoptionMessageCard}>
                        <Text style={styles.adminAdoptionFieldLabel}>Applicant Message</Text>
                        <Text style={styles.adminAdoptionMessageCardText}>{selectedAdoption.message}</Text>
                      </View>

                      <View style={styles.adminAdoptionActionRow}>
                        <Pressable style={styles.adminAdoptionApproveButton} onPress={() => store.approveAdoption(selectedAdoption.id)}>
                          <Text style={styles.adminAdoptionApproveButtonText}>{selectedAdoption.status === 'Approved' ? 'Keep Approved' : 'Approve Request'}</Text>
                        </Pressable>
                        <Pressable style={styles.adminAdoptionRejectButton} onPress={() => store.rejectAdoption(selectedAdoption.id)}>
                          <Text style={styles.adminAdoptionRejectButtonText}>{selectedAdoption.status === 'Rejected' ? 'Keep Rejected' : 'Reject Request'}</Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                </View>
              </Card>
            ) : null}
    </>
  );
}

export default function AdminAdoptionRequestsRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="adoptions" />;
}
