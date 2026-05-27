import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card } from '@/components';
import { formatAdminCurrency, formatAdminDate, getAdminDonationStatus, getAdminDonationStatusTone, getInitials, paymentMethodVisuals } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminDonationsPage() {
  const {
    store,
    setActiveRoleView,
    setActivePublicSection,
    activeAdminSection,
    setActiveAdminSection,
    setSelectedDonationId,
    adminDonationFilter,
    setAdminDonationFilter,
    adminDonationSearchTerm,
    setAdminDonationSearchTerm,
    isTablet,
    adminFilteredDonations,
    selectedDonation,
    adminDonationTabs,
    adminDonationMetrics,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'donations' ? (
              <Card title="Donations" subtitle="Manage all donations and contributions.">
                <View style={[styles.adminDonationLayout, isTablet && styles.adminDonationLayoutSplit]}>
                  <View style={[styles.adminDonationQueue, isTablet && styles.adminDonationQueueSplit]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.adminDonationMetricGrid}>
                      {adminDonationMetrics.map((metric) => (
                        <View key={metric.key} style={[styles.adminDonationMetricCard, isTablet && styles.adminDonationMetricCardSplit]}>
                          <View style={[styles.adminDonationMetricIcon, { backgroundColor: metric.tint }]}>
                            <Feather name={metric.icon} size={16} color={metric.accent} />
                          </View>
                          <Text style={styles.adminDonationMetricLabel}>{metric.label}</Text>
                          <Text style={styles.adminDonationMetricValue}>{metric.value}</Text>
                          <Text style={styles.adminDonationMetricNote}>{metric.note}</Text>
                        </View>
                      ))}
                    </ScrollView>

                    <View style={styles.adminDonationSearchRow}>
                      <View style={styles.adminDonationSearchShell}>
                        <Feather name="search" size={16} color="#94a3b8" />
                        <TextInput
                          value={adminDonationSearchTerm}
                          onChangeText={setAdminDonationSearchTerm}
                          placeholder="Search donations..."
                          placeholderTextColor="#94a3b8"
                          style={styles.adminDonationSearchInput}
                        />
                      </View>
                      <View style={styles.adminDonationFilterIcon}>
                        <Feather name="sliders" size={16} color={palette.clayDeep} />
                      </View>
                    </View>

                    <View style={styles.adminDonationTabRow}>
                      {adminDonationTabs.map((tab) => (
                        <Pressable
                          key={tab.key}
                          style={[styles.adminDonationTab, adminDonationFilter === tab.key && styles.adminDonationTabActive]}
                          onPress={() => setAdminDonationFilter(tab.key)}
                        >
                          <Text style={[styles.adminDonationTabText, adminDonationFilter === tab.key && styles.adminDonationTabTextActive]}>
                            {tab.label} ({tab.count})
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <View style={styles.adminDonationList}>
                      {adminFilteredDonations.length === 0 ? (
                        <View style={styles.adminDonationEmptyState}>
                          <Text style={styles.adminDonationEmptyTitle}>No donations found</Text>
                          <Text style={styles.adminDonationEmptyText}>Try a different search term or switch to another status tab.</Text>
                        </View>
                      ) : (
                        adminFilteredDonations.map((donation) => {
                          const status = getAdminDonationStatus(donation);
                          const statusTone = getAdminDonationStatusTone(donation);
                          const methodVisual = paymentMethodVisuals[donation.paymentMethod];
                          const donorName = donation.anonymous ? 'Anonymous Donor' : `${donation.name} ${donation.lastName}`.trim();

                          return (
                            <Pressable
                              key={donation.id}
                              style={[styles.adminDonationRow, selectedDonation?.id === donation.id && styles.adminDonationRowActive]}
                              onPress={() => {
                                setSelectedDonationId(donation.id);
                                setActiveAdminSection('donation-details');
                              }}
                            >
                              <View style={[styles.adminDonationAvatar, { backgroundColor: methodVisual.soft, borderColor: methodVisual.border }]}>
                                <Text style={[styles.adminDonationAvatarText, { color: methodVisual.accentDeep }]}>{getInitials(donorName)}</Text>
                              </View>
                              <View style={styles.adminDonationRowCopy}>
                                <Text style={styles.adminDonationRowName}>{donorName}</Text>
                                <Text style={styles.adminDonationRowMeta}>
                                  {formatAdminDate(donation.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  {'  •  '}
                                  {formatAdminDate(donation.createdAt, { hour: 'numeric', minute: '2-digit' })}
                                </Text>
                              </View>
                              <View style={styles.adminDonationAmountBlock}>
                                <Text style={styles.adminDonationAmountValue}>{formatAdminCurrency(donation.amount)}</Text>
                                <View
                                  style={[
                                    styles.adminDonationStatusPill,
                                    statusTone === 'success' && styles.adminDonationStatusPillSuccess,
                                    statusTone === 'warning' && styles.adminDonationStatusPillWarning,
                                    statusTone === 'danger' && styles.adminDonationStatusPillDanger,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.adminDonationStatusPillText,
                                      statusTone === 'success' && styles.adminDonationStatusPillTextSuccess,
                                      statusTone === 'warning' && styles.adminDonationStatusPillTextWarning,
                                      statusTone === 'danger' && styles.adminDonationStatusPillTextDanger,
                                    ]}
                                  >
                                    {status}
                                  </Text>
                                </View>
                                <Text style={styles.adminDonationMethodText}>{methodVisual.shortLabel}</Text>
                              </View>
                            </Pressable>
                          );
                        })
                      )}
                    </View>

                    {!isTablet ? (
                      <Pressable style={styles.adminDonationManualButton} onPress={() => {
                        setActiveRoleView('public');
                        setActivePublicSection('donations');
                      }}>
                        <Feather name="plus" size={16} color={palette.paper} />
                        <Text style={styles.adminDonationManualButtonText}>Add Donation (Manual)</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  {false ? (
                    <View style={[styles.adminDonationDetailCard, isTablet && styles.adminDonationDetailCardSplit]}>
                      <View style={styles.adminDonationDetailHeader}>
                        <View style={styles.adminDonationDetailIdentity}>
                          <View
                            style={[
                              styles.adminDonationDetailAvatar,
                              {
                                backgroundColor: paymentMethodVisuals[selectedDonation.paymentMethod].soft,
                                borderColor: paymentMethodVisuals[selectedDonation.paymentMethod].border,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.adminDonationAvatarText,
                                { color: paymentMethodVisuals[selectedDonation.paymentMethod].accentDeep },
                              ]}
                            >
                              {getInitials(selectedDonation.anonymous ? 'Anonymous Donor' : `${selectedDonation.name} ${selectedDonation.lastName}`)}
                            </Text>
                          </View>
                          <View style={styles.adminDonationDetailIdentityCopy}>
                            <Text style={styles.adminDonationDetailName}>
                              {selectedDonation.anonymous ? 'Anonymous Donor' : `${selectedDonation.name} ${selectedDonation.lastName}`.trim()}
                            </Text>
                            <Text style={styles.adminDonationDetailMeta}>
                              Recorded {formatAdminDate(selectedDonation.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.adminDonationStatusPill,
                            getAdminDonationStatusTone(selectedDonation) === 'success' && styles.adminDonationStatusPillSuccess,
                            getAdminDonationStatusTone(selectedDonation) === 'warning' && styles.adminDonationStatusPillWarning,
                            getAdminDonationStatusTone(selectedDonation) === 'danger' && styles.adminDonationStatusPillDanger,
                          ]}
                        >
                          <Text
                            style={[
                              styles.adminDonationStatusPillText,
                              getAdminDonationStatusTone(selectedDonation) === 'success' && styles.adminDonationStatusPillTextSuccess,
                              getAdminDonationStatusTone(selectedDonation) === 'warning' && styles.adminDonationStatusPillTextWarning,
                              getAdminDonationStatusTone(selectedDonation) === 'danger' && styles.adminDonationStatusPillTextDanger,
                            ]}
                          >
                            {getAdminDonationStatus(selectedDonation)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.adminDonationDetailInfoGrid}>
                        <View style={styles.adminDonationInfoCard}>
                          <Text style={styles.adminDonationInfoLabel}>Amount</Text>
                          <Text style={styles.adminDonationInfoValue}>{formatAdminCurrency(selectedDonation.amount)}</Text>
                          <Text style={styles.adminDonationInfoText}>Contribution total</Text>
                        </View>
                        <View style={styles.adminDonationInfoCard}>
                          <Text style={styles.adminDonationInfoLabel}>Method</Text>
                          <Text style={styles.adminDonationInfoValue}>{paymentMethodVisuals[selectedDonation.paymentMethod].shortLabel}</Text>
                          <Text style={styles.adminDonationInfoText}>{paymentMethodVisuals[selectedDonation.paymentMethod].note}</Text>
                        </View>
                        <View style={styles.adminDonationInfoCard}>
                          <Text style={styles.adminDonationInfoLabel}>Email</Text>
                          <Text style={styles.adminDonationInfoValue}>{selectedDonation.email}</Text>
                          <Text style={styles.adminDonationInfoText}>{selectedDonation.anonymous ? 'Marked anonymous to the public' : 'Visible donor profile'}</Text>
                        </View>
                        <View style={styles.adminDonationInfoCard}>
                          <Text style={styles.adminDonationInfoLabel}>Location</Text>
                          <Text style={styles.adminDonationInfoValue}>{selectedDonation.state ?? 'State not set'}</Text>
                          <Text style={styles.adminDonationInfoText}>{[selectedDonation.country, selectedDonation.zipCode].filter(Boolean).join(' • ') || 'No extra location details'}</Text>
                        </View>
                      </View>

                      <View style={styles.adminDonationNoteCard}>
                        <Text style={styles.adminDonationInfoLabel}>Payment Notes</Text>
                        <Text style={styles.adminDonationNoteText}>{selectedDonation.notes || 'No additional payment notes provided.'}</Text>
                      </View>

                      <View style={styles.adminDonationDetailActions}>
                        <Pressable style={styles.adminDonationManualButton} onPress={() => {
                          setActiveRoleView('public');
                          setActivePublicSection('donations');
                        }}>
                          <Feather name="plus" size={16} color={palette.paper} />
                          <Text style={styles.adminDonationManualButtonText}>Add Donation (Manual)</Text>
                        </Pressable>
                        <Pressable style={styles.adminDonationDeleteButton} onPress={() => store.deleteDonation(selectedDonation.id)}>
                          <Text style={styles.adminDonationDeleteButtonText}>Delete Donation Record</Text>
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

export default function AdminDonationsRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="donations" />;
}
