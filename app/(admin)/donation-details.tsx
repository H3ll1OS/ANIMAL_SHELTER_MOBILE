import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Card } from '@/components';
import { formatAdminCurrency, formatAdminDate, getAdminDonationStatus, getAdminDonationStatusTone, getInitials, paymentMethodVisuals } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function AdminDonationDetailsPage() {
  const {
    store,
    activeAdminSection,
    setActiveAdminSection,
    selectedDonation,
    selectedDonationDonorSince,
    selectedDonationTransactionId,
  } = useShelterAppContext();

  return (
    <>
            {activeAdminSection === 'donation-details' ? (
              <Card title="Donation Details" subtitle="Review the donor record and payment summary.">
                {selectedDonation ? (
                  <View style={styles.adminDonationDetailsPage}>
                    <Pressable style={styles.adminDonationBackButton} onPress={() => setActiveAdminSection('donations')}>
                      <Feather name="chevron-left" size={18} color={palette.ink} />
                      <Text style={styles.adminDonationBackButtonText}>Back to donations</Text>
                    </Pressable>

                    <View style={styles.adminDonationDetailsHero}>
                      <View style={styles.adminDonationDetailsHeroHeader}>
                        <View style={styles.adminDonationDetailsHeroIdentity}>
                          <View style={styles.adminDonationDetailsHeroAvatar}>
                            <Text style={styles.adminDonationDetailsHeroAvatarText}>
                              {getInitials(selectedDonation.anonymous ? 'Anonymous Donor' : `${selectedDonation.name} ${selectedDonation.lastName}`)}
                            </Text>
                          </View>
                          <View style={styles.adminDonationDetailsHeroCopy}>
                            <Text style={styles.adminDonationDetailsHeroName}>
                              {selectedDonation.anonymous ? 'Anonymous Donor' : `${selectedDonation.name} ${selectedDonation.lastName}`.trim()}
                            </Text>
                            <Text style={styles.adminDonationDetailsHeroEmail}>{selectedDonation.email}</Text>
                            <Text style={styles.adminDonationDetailsHeroMeta}>
                              Donor since {selectedDonationDonorSince ? formatAdminDate(selectedDonationDonorSince, { month: 'short', year: 'numeric' }) : 'this year'}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.adminDonationStatusPill,
                            getAdminDonationStatusTone(selectedDonation) === 'success' && styles.adminDonationStatusPillSuccess,
                            getAdminDonationStatusTone(selectedDonation) === 'warning' && styles.adminDonationStatusPillWarning,
                            styles.adminDonationDetailsHeroStatus,
                          ]}
                        >
                          <Text
                            style={[
                              styles.adminDonationStatusPillText,
                              getAdminDonationStatusTone(selectedDonation) === 'success' && styles.adminDonationStatusPillTextSuccess,
                              getAdminDonationStatusTone(selectedDonation) === 'warning' && styles.adminDonationStatusPillTextWarning,
                            ]}
                          >
                            {getAdminDonationStatus(selectedDonation)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.adminDonationDetailsHeroStats}>
                        <View style={styles.adminDonationDetailsHeroStat}>
                          <Text style={styles.adminDonationDetailsHeroStatLabel}>Donation Amount</Text>
                          <Text style={styles.adminDonationDetailsHeroStatValue}>{formatAdminCurrency(selectedDonation.amount)}</Text>
                        </View>
                        <View style={styles.adminDonationDetailsHeroStat}>
                          <Text style={styles.adminDonationDetailsHeroStatLabel}>Donation ID</Text>
                          <Text style={styles.adminDonationDetailsHeroStatValueSmall}>{selectedDonation.id.toUpperCase()}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.adminDonationDetailsSection}>
                      <Text style={styles.adminDonationDetailsSectionTitle}>Donation Information</Text>
                      <View style={styles.adminDonationDetailsInfoList}>
                        <View style={styles.adminDonationDetailsInfoRow}>
                          <View style={styles.adminDonationDetailsInfoLabelWrap}>
                            <Feather name="calendar" size={15} color="#94a3b8" />
                            <Text style={styles.adminDonationDetailsInfoLabel}>Date & Time</Text>
                          </View>
                          <Text style={styles.adminDonationDetailsInfoValue}>
                            {formatAdminDate(selectedDonation.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })} • {formatAdminDate(selectedDonation.createdAt, { hour: 'numeric', minute: '2-digit' })}
                          </Text>
                        </View>
                        <View style={styles.adminDonationDetailsInfoRow}>
                          <View style={styles.adminDonationDetailsInfoLabelWrap}>
                            <Feather name="tag" size={15} color="#94a3b8" />
                            <Text style={styles.adminDonationDetailsInfoLabel}>Purpose</Text>
                          </View>
                          <Text style={styles.adminDonationDetailsInfoValue}>General Support</Text>
                        </View>
                        <View style={styles.adminDonationDetailsInfoRow}>
                          <View style={styles.adminDonationDetailsInfoLabelWrap}>
                            <Feather name="credit-card" size={15} color="#94a3b8" />
                            <Text style={styles.adminDonationDetailsInfoLabel}>Payment Method</Text>
                          </View>
                          <Text style={styles.adminDonationDetailsInfoValue}>{paymentMethodVisuals[selectedDonation.paymentMethod].shortLabel}</Text>
                        </View>
                        <View style={styles.adminDonationDetailsInfoRow}>
                          <View style={styles.adminDonationDetailsInfoLabelWrap}>
                            <Feather name="hash" size={15} color="#94a3b8" />
                            <Text style={styles.adminDonationDetailsInfoLabel}>Transaction ID</Text>
                          </View>
                          <Text style={styles.adminDonationDetailsInfoValue}>{selectedDonationTransactionId}</Text>
                        </View>
                        <View style={styles.adminDonationDetailsInfoRow}>
                          <View style={styles.adminDonationDetailsInfoLabelWrap}>
                            <Feather name="file-text" size={15} color="#94a3b8" />
                            <Text style={styles.adminDonationDetailsInfoLabel}>Receipt</Text>
                          </View>
                          <Text style={styles.adminDonationDetailsReceiptLink}>View Record</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.adminDonationDetailsSection}>
                      <Text style={styles.adminDonationDetailsSectionTitle}>Message from Donor</Text>
                      <View style={styles.adminDonationDetailsMessageCard}>
                        <View style={styles.adminDonationDetailsMessageBubble}>
                          <Text style={styles.adminDonationDetailsMessageBubbleText}>
                            {getInitials(selectedDonation.anonymous ? 'Anonymous Donor' : `${selectedDonation.name} ${selectedDonation.lastName}`)}
                          </Text>
                        </View>
                        <Text style={styles.adminDonationDetailsMessageText}>
                          {selectedDonation.notes || `Donation made via ${paymentMethodVisuals[selectedDonation.paymentMethod].shortLabel}.`}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.adminDonationDetailsSection}>
                      <Text style={styles.adminDonationDetailsSectionTitle}>Donation Breakdown</Text>
                      <View style={styles.adminDonationDetailsBreakdownCard}>
                        <View style={styles.adminDonationDetailsBreakdownRow}>
                          <Text style={styles.adminDonationDetailsBreakdownLabel}>Amount</Text>
                          <Text style={styles.adminDonationDetailsBreakdownValue}>{formatAdminCurrency(selectedDonation.amount)}</Text>
                        </View>
                        <View style={styles.adminDonationDetailsBreakdownRow}>
                          <Text style={styles.adminDonationDetailsBreakdownLabel}>Processing Fee</Text>
                          <Text style={styles.adminDonationDetailsBreakdownValue}>{formatAdminCurrency(0)}</Text>
                        </View>
                        <View style={styles.adminDonationDetailsBreakdownRow}>
                          <Text style={styles.adminDonationDetailsBreakdownNetLabel}>Net Amount</Text>
                          <Text style={styles.adminDonationDetailsBreakdownNetValue}>{formatAdminCurrency(selectedDonation.amount)}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.adminDonationDetailsActionRow}>
                      <Pressable style={styles.adminDonationDetailsSecondaryButton} onPress={() => setActiveAdminSection('donations')}>
                        <Feather name="corner-up-left" size={16} color={palette.clayDeep} />
                        <Text style={styles.adminDonationDetailsSecondaryButtonText}>Back to list</Text>
                      </Pressable>
                      <Pressable style={styles.adminDonationDetailsPrimaryButton} onPress={async () => {
                        await store.deleteDonation(selectedDonation.id);
                        setActiveAdminSection('donations');
                      }}>
                        <Feather name="trash-2" size={16} color={palette.paper} />
                        <Text style={styles.adminDonationDetailsPrimaryButtonText}>Delete record</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </Card>
            ) : null}
    </>
  );
}

export default function AdminDonationDetailsRoute() {
  return <ShelterMobileApp initialRoleView="admin" initialAdminSection="donation-details" />;
}
