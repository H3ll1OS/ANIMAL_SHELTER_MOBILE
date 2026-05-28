import { ShelterMobileApp } from '@/components/AppShell';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
import { palette } from '@/constants/premium-theme';
import { Field, PaymentMethodLogo, PrimaryButton, pressableFeedback } from '@/components';
import { paymentMethodVisuals } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientDonationsPage() {
  const {
    activePublicSection,
    activeDonationStep,
    setActiveDonationStep,
    donationForm,
    setDonationForm,
    isTablet,
    clientSplitFieldStyle,
    donationAmountValue,
    donationTotalValue,
    donationPaymentDetails,
    donationMethodOptions,
    isSubmittingDonation,
    submitClientDonation,
  } = useShelterAppContext();

  const quickAmounts = ['100', '250', '500', '1000'];
  const donorDisplayName = donationForm.anonymous
    ? 'Anonymous donor'
    : `${donationForm.name || 'Your'} ${donationForm.lastName || 'Name'}`.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donationForm.email.trim());
  const hasAccountDetails = Boolean(
    donationForm.name.trim()
      && donationForm.lastName.trim()
      && isEmailValid
      && donationForm.state.trim()
      && donationForm.country.trim()
      && donationForm.zipCode.trim(),
  );
  const hasValidAmount = donationAmountValue > 0;
  const hasPaymentDetails = Boolean(donationForm.detailA.trim() && donationForm.detailB.trim());
  const canConfirmDonation = hasAccountDetails && hasValidAmount && hasPaymentDetails;

  return (
    <>
            {activePublicSection === 'donations' ? (
              <View style={styles.clientDonateScreen}>
                <View style={styles.clientDonateTopBar}>
                  <Pressable
                    style={pressableFeedback([styles.clientDonateBackButton, activeDonationStep === 'account' && styles.clientDonateBackButtonMuted], activeDonationStep === 'account')}
                    onPress={() => {
                      if (activeDonationStep === 'send') {
                        setActiveDonationStep('account');
                      }
                    }}
                    disabled={activeDonationStep === 'account'}
                  >
                    <Feather name="arrow-left" size={20} color={palette.ink} />
                  </Pressable>
                  <Text style={styles.clientDonateTopTitle}>{activeDonationStep === 'account' ? 'Donation Details' : 'Complete Donation'}</Text>
                  <View style={styles.clientDonateBackButtonSpacer} />
                </View>

                <View style={styles.clientDonateTabRow}>
                  <Pressable style={pressableFeedback([styles.clientDonateTab, activeDonationStep === 'account' && styles.clientDonateTabActive])} onPress={() => setActiveDonationStep('account')}>
                    <View style={[styles.clientDonateStepDot, activeDonationStep === 'account' && styles.clientDonateStepDotActive]}>
                      <Text style={[styles.clientDonateStepDotText, activeDonationStep === 'account' && styles.clientDonateStepDotTextActive]}>1</Text>
                    </View>
                    <Text style={[styles.clientDonateTabText, activeDonationStep === 'account' && styles.clientDonateTabTextActive]}>Account</Text>
                  </Pressable>
                  <Pressable
                    style={pressableFeedback([styles.clientDonateTab, activeDonationStep === 'send' && styles.clientDonateTabActive, !hasAccountDetails && styles.clientDonateTabDisabled], !hasAccountDetails)}
                    onPress={() => setActiveDonationStep('send')}
                    disabled={!hasAccountDetails}
                  >
                    <View style={[styles.clientDonateStepDot, activeDonationStep === 'send' && styles.clientDonateStepDotActive, !hasAccountDetails && styles.clientDonateStepDotDisabled]}>
                      <Text style={[styles.clientDonateStepDotText, activeDonationStep === 'send' && styles.clientDonateStepDotTextActive]}>2</Text>
                    </View>
                    <Text style={[styles.clientDonateTabText, activeDonationStep === 'send' && styles.clientDonateTabTextActive]}>Payment</Text>
                  </Pressable>
                </View>

                {activeDonationStep === 'account' ? (
                  <>
                    <View style={styles.clientDonateCard}>
                      <View style={styles.clientDonateCardHeader}>
                        <View>
                          <Text style={styles.clientDonateCardTitle}>Donor details</Text>
                        </View>
                        <Feather name="edit-3" size={16} color={palette.clayDeep} />
                      </View>
                      <View style={styles.clientDonateAccountRow}>
                        <View style={styles.clientDonateAccountIcon}>
                          <Feather name="user" size={16} color={palette.clayDeep} />
                        </View>
                        <View style={styles.clientDonateAccountCopy}>
                          <Text style={styles.clientDonateAccountName}>{donorDisplayName}</Text>
                          <Text style={styles.clientDonateAccountMeta}>{donationForm.email || 'Add your email for receipt records'}</Text>
                        </View>
                        <Pressable style={pressableFeedback([styles.clientDonateAnonymousChip, donationForm.anonymous && styles.clientDonateAnonymousChipActive])} onPress={() => setDonationForm((current) => ({ ...current, anonymous: !current.anonymous }))}>
                          <Text style={[styles.clientDonateAnonymousChipText, donationForm.anonymous && styles.clientDonateAnonymousChipTextActive]}>{donationForm.anonymous ? 'Anonymous' : 'Named'}</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={[styles.clientDonateFieldGrid, isTablet && styles.clientDonateFieldGridWide]}>
                      <View style={[styles.clientDonateCard, styles.clientDonateInfoCard, clientSplitFieldStyle]}>
                        <View style={styles.clientDonateCardHeader}>
                          <View>
                            <Text style={styles.clientDonateCardTitle}>Contact details</Text>
                          </View>
                          <Feather name="mail" size={16} color={palette.clayDeep} />
                        </View>
                        <View style={styles.clientDonateFieldGrid}>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="First Name" value={donationForm.name} onChangeText={(value) => setDonationForm((current) => ({ ...current, name: value }))} />
                          </View>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="Last Name" value={donationForm.lastName} onChangeText={(value) => setDonationForm((current) => ({ ...current, lastName: value }))} />
                          </View>
                          <View style={styles.clientDonateFieldItem}>
                            <Field label="Email" value={donationForm.email} error={donationForm.email && !isEmailValid ? 'Enter a valid email address.' : null} onChangeText={(value) => setDonationForm((current) => ({ ...current, email: value }))} />
                          </View>
                        </View>
                      </View>

                      <View style={[styles.clientDonateCard, styles.clientDonateInfoCard, clientSplitFieldStyle]}>
                        <View style={styles.clientDonateCardHeader}>
                          <View>
                            <Text style={styles.clientDonateCardTitle}>Location</Text>
                          </View>
                          <Feather name="map-pin" size={16} color={palette.clayDeep} />
                        </View>
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

                    {!hasAccountDetails ? (
                      <View style={styles.clientDonateNotice}>
                        <Feather name="alert-circle" size={15} color={palette.warning} />
                        <Text style={styles.clientDonateNoticeText}>Complete required details to continue.</Text>
                      </View>
                    ) : null}

                    <PrimaryButton label="Continue To Payment" onPress={() => setActiveDonationStep('send')} disabled={!hasAccountDetails} />
                  </>
                ) : (
                  <>
                    <View style={styles.clientDonateCard}>
                      <View style={styles.clientDonateCardHeader}>
                        <View>
                          <Text style={styles.clientDonateCardTitle}>Giving as</Text>
                        </View>
                        <Pressable style={pressableFeedback(styles.clientDonateEditButton)} onPress={() => setActiveDonationStep('account')}>
                          <Feather name="edit-2" size={14} color={palette.clayDeep} />
                          <Text style={styles.clientDonateEditButtonText}>Edit</Text>
                        </Pressable>
                      </View>
                      <View style={styles.clientDonateAccountRow}>
                        <View style={styles.clientDonateAccountIcon}>
                          <Feather name="user" size={16} color={palette.clayDeep} />
                        </View>
                        <View style={styles.clientDonateAccountCopy}>
                          <Text style={styles.clientDonateAccountName}>{donorDisplayName}</Text>
                          <Text style={styles.clientDonateAccountMeta}>{donationForm.email || 'Email required for receipt records'}</Text>
                        </View>
                        <Pressable style={pressableFeedback([styles.clientDonateAnonymousChip, donationForm.anonymous && styles.clientDonateAnonymousChipActive])} onPress={() => setDonationForm((current) => ({ ...current, anonymous: !current.anonymous }))}>
                          <Text style={[styles.clientDonateAnonymousChipText, donationForm.anonymous && styles.clientDonateAnonymousChipTextActive]}>{donationForm.anonymous ? 'Anonymous' : 'Named'}</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.clientDonateCard}>
                      <View style={styles.clientDonateCardHeader}>
                        <View>
                          <Text style={styles.clientDonateCardTitle}>Donating to</Text>
                        </View>
                        <Feather name="shield" size={16} color={palette.clayDeep} />
                      </View>
                      <View style={styles.clientDonateRecipientCard}>
                        <View style={styles.clientDonateRecipientMedia}>
                          <Feather name="heart" size={18} color="#ffffff" />
                        </View>
                        <View style={styles.clientDonateRecipientCopy}>
                          <Text style={styles.clientDonateRecipientTitle}>Animal Shelter Rescue Fund</Text>
                        </View>
                        <View style={styles.clientDonateRecipientBadge}>
                          <Text style={styles.clientDonateRecipientBadgeText}>Active</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.clientDonateCard}>
                      <View style={styles.clientDonateCardHeader}>
                        <View>
                          <Text style={styles.clientDonateCardTitle}>Amount</Text>
                        </View>
                        <Text style={styles.clientDonateCurrencyText}>PHP</Text>
                      </View>
                      <View style={styles.clientDonateQuickAmountRow}>
                        {quickAmounts.map((amount) => {
                          const isActive = donationForm.amount === amount;
                          return (
                            <Pressable key={amount} style={pressableFeedback([styles.clientDonateQuickAmount, isActive && styles.clientDonateQuickAmountActive])} onPress={() => setDonationForm((current) => ({ ...current, amount }))}>
                              <Text style={[styles.clientDonateQuickAmountText, isActive && styles.clientDonateQuickAmountTextActive]}>PHP {amount}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
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
                      {!hasValidAmount ? <Text style={styles.clientDonateInlineError}>Enter an amount greater than PHP 0.</Text> : null}
                    </View>

                    <View style={styles.clientDonateCard}>
                      <View style={styles.clientDonateCardHeader}>
                        <View>
                          <Text style={styles.clientDonateCardTitle}>Payment Options</Text>
                        </View>
                      </View>
                      <View style={styles.clientDonatePaymentMethodGrid}>
                        {donationMethodOptions.map((option) => {
                          const isActive = donationForm.paymentMethod === option.method;
                          const visual = paymentMethodVisuals[option.method];
                          return (
                            <Pressable
                              key={option.method}
                              style={pressableFeedback([
                                styles.clientDonatePaymentOption,
                                isActive && [styles.clientDonatePaymentOptionActive, { backgroundColor: visual.soft, borderColor: visual.border }],
                              ])}
                              onPress={() => setDonationForm((current) => ({ ...current, paymentMethod: option.method }))}
                            >
                              <View style={[styles.clientDonatePaymentRadio, isActive && styles.clientDonatePaymentRadioActive]}>
                                {isActive ? <View style={styles.clientDonatePaymentRadioDot} /> : null}
                              </View>
                              <PaymentMethodLogo method={option.method} active={isActive} compact />
                              <View style={styles.clientDonatePaymentOptionCopy}>
                                <Text style={styles.clientDonatePaymentOptionTitle}>{visual.shortLabel}</Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>

                      <View style={styles.clientDonatePaymentDetailsBox}>
                        <View style={styles.clientDonatePaymentDetailsHeader}>
                          <View>
                            <Text style={styles.clientDonatePaymentDetailsTitle}>{donationPaymentDetails.label}</Text>
                            <Text style={styles.clientDonatePaymentDetailsText}>{donationPaymentDetails.preview}</Text>
                          </View>
                          <Feather name="lock" size={15} color={palette.clayDeep} />
                        </View>
                        <View style={[styles.clientDonatePaymentFieldGrid, isTablet && styles.clientDonateFieldGridWide]}>
                        <View style={[styles.clientDonateFieldItem, clientSplitFieldStyle]}>
                          <Field label={donationPaymentDetails.detailALabel} value={donationForm.detailA} onChangeText={(value) => setDonationForm((current) => ({ ...current, detailA: value }))} />
                        </View>
                        <View style={[styles.clientDonateFieldItem, clientSplitFieldStyle]}>
                          <Field label={donationPaymentDetails.detailBLabel} value={donationForm.detailB} onChangeText={(value) => setDonationForm((current) => ({ ...current, detailB: value }))} />
                        </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.clientDonateSummaryCard}>
                      <View style={styles.clientDonateCardHeader}>
                        <View>
                          <Text style={styles.clientDonateLabel}>Review</Text>
                          <Text style={styles.clientDonateCardTitle}>Summary</Text>
                        </View>
                        <Feather name="clipboard" size={16} color={palette.clayDeep} />
                      </View>
                      <View style={styles.clientDonateSummaryList}>
                        <View style={styles.clientDonateSummaryRow}>
                          <Text style={styles.clientDonateSummaryLabel}>Donor</Text>
                          <Text style={styles.clientDonateSummaryValue}>{donorDisplayName}</Text>
                        </View>
                        <View style={styles.clientDonateSummaryRow}>
                          <Text style={styles.clientDonateSummaryLabel}>Recipient</Text>
                          <Text style={styles.clientDonateSummaryValue}>Animal Shelter Rescue Fund</Text>
                        </View>
                        <View style={styles.clientDonateSummaryRow}>
                          <Text style={styles.clientDonateSummaryLabel}>Method</Text>
                          <Text style={styles.clientDonateSummaryValue}>{donationPaymentDetails.label}</Text>
                        </View>
                      </View>
                      {!canConfirmDonation ? (
                        <View style={styles.clientDonateNotice}>
                          <Feather name="alert-circle" size={15} color={palette.warning} />
                          <Text style={styles.clientDonateNoticeText}>Complete payment details to confirm.</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.clientDonateTotalsCard}>
                      <View style={styles.clientDonateTotalSummaryIcon}>
                        <Feather name="gift" size={18} color="#ffffff" />
                      </View>
                      <View style={styles.clientDonateTotalRow}>
                        <View style={styles.clientDonateTotalCopy}>
                          <Text style={styles.clientDonateGrandLabel}>Donation total</Text>
                          <Text style={styles.clientDonateTotalLabel}>Processed through {donationPaymentDetails.label}</Text>
                        </View>
                        <Text style={styles.clientDonateGrandValue}>PHP {donationTotalValue.toFixed(2)}</Text>
                      </View>
                    </View>

                    <View style={styles.clientDonateActionRow}>
                      <PrimaryButton label={isSubmittingDonation ? 'Submitting Donation...' : 'Confirm Donation'} disabled={!canConfirmDonation || isSubmittingDonation} onPress={submitClientDonation} />
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
