import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Field, PaymentMethodLogo, PrimaryButton } from '@/components';
import { paymentMethodVisuals } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientDonationsPage() {
  const {
    store,
    activePublicSection,
    activeDonationStep,
    setActiveDonationStep,
    donationForm,
    setDonationForm,
    isPaymentMethodMenuOpen,
    setIsPaymentMethodMenuOpen,
    isTablet,
    clientSplitFieldStyle,
    donationAmountValue,
    donationTotalValue,
    donationPaymentDetails,
    donationMethodOptions,
    activeDonationMethodVisual,
  } = useShelterAppContext();

  return (
    <>
            {activePublicSection === 'donations' ? (
              <View style={styles.clientDonateScreen}>
                <View style={styles.clientDonateTabRow}>
                  <Pressable style={[styles.clientDonateTab, activeDonationStep === 'account' && styles.clientDonateTabActive]} onPress={() => setActiveDonationStep('account')}>
                    <Text style={[styles.clientDonateTabText, activeDonationStep === 'account' && styles.clientDonateTabTextActive]}>Account Information</Text>
                  </Pressable>
                  <Pressable style={[styles.clientDonateTab, activeDonationStep === 'send' && styles.clientDonateTabActive]} onPress={() => setActiveDonationStep('send')}>
                    <Text style={[styles.clientDonateTabText, activeDonationStep === 'send' && styles.clientDonateTabTextActive]}>Send Donation</Text>
                  </Pressable>
                </View>

                {activeDonationStep === 'account' ? (
                  <>
                    <View style={styles.clientDonateCard}>
                      <Text style={styles.clientDonateLabel}>Donor</Text>
                      <View style={styles.clientDonateAccountRow}>
                        <View style={styles.clientDonateAccountIcon}>
                          <Feather name="user" size={16} color={palette.clayDeep} />
                        </View>
                        <View style={styles.clientDonateAccountCopy}>
                          <Text style={styles.clientDonateAccountName}>{donationForm.name} {donationForm.lastName}</Text>
                          <Text style={styles.clientDonateAccountMeta}>{donationForm.email}</Text>
                        </View>
                        <Pressable style={[styles.clientDonateAnonymousChip, donationForm.anonymous && styles.clientDonateAnonymousChipActive]} onPress={() => setDonationForm((current) => ({ ...current, anonymous: !current.anonymous }))}>
                          <Text style={[styles.clientDonateAnonymousChipText, donationForm.anonymous && styles.clientDonateAnonymousChipTextActive]}>{donationForm.anonymous ? 'Anonymous' : 'Named'}</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={[styles.clientDonateFieldGrid, isTablet && styles.clientDonateFieldGridWide]}>
                      <View style={[styles.clientDonateCard, styles.clientDonateInfoCard, clientSplitFieldStyle]}>
                        <Text style={styles.clientDonateLabel}>Account Information</Text>
                        <View style={styles.clientDonateFieldGrid}>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="First Name" value={donationForm.name} onChangeText={(value) => setDonationForm((current) => ({ ...current, name: value }))} />
                          </View>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="Last Name" value={donationForm.lastName} onChangeText={(value) => setDonationForm((current) => ({ ...current, lastName: value }))} />
                          </View>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="Email" value={donationForm.email} onChangeText={(value) => setDonationForm((current) => ({ ...current, email: value }))} />
                          </View>
                        </View>
                      </View>

                      <View style={[styles.clientDonateCard, styles.clientDonateInfoCard, clientSplitFieldStyle]}>
                        <Text style={styles.clientDonateLabel}>Billing Address</Text>
                        <View style={styles.clientDonateFieldGrid}>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="State" value={donationForm.state} onChangeText={(value) => setDonationForm((current) => ({ ...current, state: value }))} />
                          </View>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="Country" value={donationForm.country} onChangeText={(value) => setDonationForm((current) => ({ ...current, country: value }))} />
                          </View>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="Zip Code" value={donationForm.zipCode} onChangeText={(value) => setDonationForm((current) => ({ ...current, zipCode: value }))} />
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.clientDonateCard}>
                      <Text style={styles.clientDonateLabel}>Donor Preview</Text>
                      <Text style={styles.clientDonatePreviewText}>
                        This donation will be recorded under {donationForm.anonymous ? 'an anonymous donor' : `${donationForm.name || 'your name'} ${donationForm.lastName || ''}`.trim()} using {donationPaymentDetails.label}.
                      </Text>
                    </View>

                    <PrimaryButton label="Continue To Payment" onPress={() => setActiveDonationStep('send')} />
                  </>
                ) : (
                  <>
                    <View style={styles.clientDonateCard}>
                      <Text style={styles.clientDonateLabel}>Donor</Text>
                      <View style={styles.clientDonateAccountRow}>
                        <View style={styles.clientDonateAccountIcon}>
                          <Feather name="user" size={16} color={palette.clayDeep} />
                        </View>
                        <View style={styles.clientDonateAccountCopy}>
                          <Text style={styles.clientDonateAccountName}>{donationForm.name} {donationForm.lastName}</Text>
                          <Text style={styles.clientDonateAccountMeta}>{donationForm.email}</Text>
                        </View>
                        <Pressable style={[styles.clientDonateAnonymousChip, donationForm.anonymous && styles.clientDonateAnonymousChipActive]} onPress={() => setDonationForm((current) => ({ ...current, anonymous: !current.anonymous }))}>
                          <Text style={[styles.clientDonateAnonymousChipText, donationForm.anonymous && styles.clientDonateAnonymousChipTextActive]}>{donationForm.anonymous ? 'Anonymous' : 'Named'}</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.clientDonateCard}>
                      <Text style={styles.clientDonateLabel}>Donation Recipient</Text>
                      <View style={styles.clientDonateRecipientCard}>
                        <View style={styles.clientDonateRecipientMedia}>
                          <Feather name="heart" size={18} color="#ffffff" />
                        </View>
                        <View style={styles.clientDonateRecipientCopy}>
                          <Text style={styles.clientDonateRecipientTitle}>Animal Shelter Rescue Fund</Text>
                          <Text style={styles.clientDonateRecipientText}>by Community shelter care</Text>
                        </View>
                        <View style={styles.clientDonateRecipientBadge}>
                          <Text style={styles.clientDonateRecipientBadgeText}>Active</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.clientDonateCard}>
                      <Text style={styles.clientDonateLabel}>Enter Amount</Text>
                      <View style={styles.clientDonateAmountWrap}>
                        <Text style={styles.clientDonateAmountPrefix}>PHP</Text>
                        <TextInput
                          nativeID="donation-amount"
                          value={donationForm.amount}
                          onChangeText={(value) => setDonationForm((current) => ({ ...current, amount: value }))}
                          keyboardType="decimal-pad"
                          style={styles.clientDonateAmountInput}
                          placeholder="100.00"
                          placeholderTextColor="#94a3b8"
                        />
                        <Text style={styles.clientDonateAmountSuffix}>.00</Text>
                      </View>
                    </View>

                    <View style={styles.clientDonateCard}>
                      <Text style={styles.clientDonateLabel}>Payment Method</Text>
                      <View style={styles.clientDonateMethodPicker}>
                        <Pressable
                          style={[
                            styles.clientDonateMethodTrigger,
                            isPaymentMethodMenuOpen && [styles.clientDonateMethodTriggerOpen, { borderColor: activeDonationMethodVisual.border }],
                          ]}
                          onPress={() => setIsPaymentMethodMenuOpen((current) => !current)}
                        >
                          <View style={styles.clientDonateMethodTriggerValue}>
                            <Text style={styles.clientDonateMethodTriggerPreview}>{donationPaymentDetails.preview}</Text>
                            <Text style={styles.clientDonateMethodTriggerNote}>{donationPaymentDetails.label}</Text>
                          </View>
                          <View style={styles.clientDonateMethodTriggerMeta}>
                            <PaymentMethodLogo method={donationForm.paymentMethod} />
                            <Feather name={isPaymentMethodMenuOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#94a3b8" />
                          </View>
                        </Pressable>

                        {isPaymentMethodMenuOpen ? (
                          <View style={styles.clientDonateMethodDropdown}>
                            {donationMethodOptions.map((option) => {
                              const isActive = donationForm.paymentMethod === option.method;
                              const visual = paymentMethodVisuals[option.method];
                              return (
                                <Pressable
                                  key={option.method}
                                  style={[
                                    styles.clientDonateMethodOption,
                                    isActive && [styles.clientDonateMethodOptionActive, { backgroundColor: visual.soft, borderColor: visual.border }],
                                  ]}
                                  onPress={() => {
                                    setDonationForm((current) => ({ ...current, paymentMethod: option.method }));
                                    setIsPaymentMethodMenuOpen(false);
                                  }}
                                >
                                  <PaymentMethodLogo method={option.method} />
                                  <View style={styles.clientDonateMethodOptionCopy}>
                                    <Text style={styles.clientDonateMethodOptionTitle}>{visual.shortLabel}</Text>
                                    <Text style={styles.clientDonateMethodOptionText}>{visual.note}</Text>
                                  </View>
                                  {isActive ? <Feather name="check" size={16} color={visual.accentDeep} /> : null}
                                </Pressable>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>

                      <View style={[styles.clientDonateFieldGrid, isTablet && styles.clientDonateFieldGridWide]}>
                        <View style={[styles.clientDonateFieldItem, clientSplitFieldStyle]}>
                          <Field label={donationPaymentDetails.detailALabel} value={donationForm.detailA} onChangeText={(value) => setDonationForm((current) => ({ ...current, detailA: value }))} />
                        </View>
                        <View style={[styles.clientDonateFieldItem, clientSplitFieldStyle]}>
                          <Field label={donationPaymentDetails.detailBLabel} value={donationForm.detailB} onChangeText={(value) => setDonationForm((current) => ({ ...current, detailB: value }))} />
                        </View>
                      </View>
                    </View>

                    <View style={styles.clientDonateTotalsCard}>
                      <View style={styles.clientDonateTotalRow}>
                        <Text style={styles.clientDonateGrandLabel}>Total</Text>
                        <Text style={styles.clientDonateGrandValue}>PHP {donationTotalValue.toFixed(2)}</Text>
                      </View>
                    </View>

                    <View style={styles.clientDonateActionRow}>
                      <PrimaryButton label="Confirm Donation" onPress={() => store.submitDonation({ name: donationForm.name, lastName: donationForm.lastName, email: donationForm.email, state: donationForm.state, country: donationForm.country, zipCode: donationForm.zipCode, amount: donationAmountValue, anonymous: donationForm.anonymous, paymentMethod: donationForm.paymentMethod, paymentDetailSummary: `Method: ${donationPaymentDetails.label} | ${donationForm.detailA} | ${donationForm.detailB}` })} />
                    </View>
                  </>
                )}
              </View>
            ) : null}
    </>
  );
}

export default function ClientDonationsRoute() {
  return <ShelterMobileApp initialRoleView="public" initialPublicSection="donations" />;
}
