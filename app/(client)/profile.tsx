import { ShelterMobileApp } from '@/components/AppShell';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Field, PrimaryButton, SettingsRow, StatusBadge } from '@/components';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientAccountPage() {
  const [language, setLanguage] = useState('English');
  const [themePreference, setThemePreference] = useState('Light');
  const [activeSettingsPanel, setActiveSettingsPanel] = useState<'language' | 'theme' | 'support' | 'terms' | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const {
    store,
    setActiveRoleView,
    activePublicSection,
    notificationsEnabled,
    setNotificationsEnabled,
    showProfileEditor,
    setShowProfileEditor,
    showPasswordEditor,
    setShowPasswordEditor,
    profileForm,
    setProfileForm,
    passwordForm,
    setPasswordForm,
    currentUser,
    isTablet,
    canSeeAdmin,
    canSeeDeveloper,
    showWorkspaceSwitcher,
    clientSplitFieldStyle,
    clientFullFieldStyle,
    currentUserAdoptions,
    accountInitials,
  } = useShelterAppContext();
  const hasCurrentPassword = passwordForm.currentPassword.trim().length > 0;
  const hasValidNextPassword = passwordForm.nextPassword.trim().length >= 8;
  const passwordsMatch = passwordForm.nextPassword === confirmPassword;
  const canUpdatePassword = hasCurrentPassword && hasValidNextPassword && passwordsMatch;

  const openPasswordEditor = () => {
    setActiveSettingsPanel(null);
    setPasswordFeedback(null);
    setShowPasswordEditor((current) => {
      const nextValue = !current;
      if (nextValue) {
        setPasswordForm({ currentPassword: '', nextPassword: '' });
        setConfirmPassword('');
      }
      return nextValue;
    });
  };

  const handlePasswordUpdate = async () => {
    if (!canUpdatePassword) {
      setPasswordFeedback({ tone: 'error', message: 'Enter your current password and matching new password.' });
      return;
    }

    try {
      await store.changePassword(passwordForm.currentPassword, passwordForm.nextPassword);
      setPasswordForm({ currentPassword: '', nextPassword: '' });
      setConfirmPassword('');
      setPasswordFeedback({ tone: 'success', message: 'Password updated successfully.' });
    } catch {
      setPasswordFeedback({ tone: 'error', message: 'Password update failed. Check your current password and try again.' });
    }
  };

  return (
    <>
            {activePublicSection === 'account' ? (
              <View style={styles.clientSettingsScreen}>
                {currentUser ? (
                  <>
                    <View style={styles.clientSettingsHero}>
                      <View style={styles.clientSettingsHeroTop}>
                        <View style={styles.clientSettingsHeaderCopy}>
                          <Text style={styles.clientSettingsEyebrow}>Account</Text>
                          <Text style={styles.clientSettingsTitle}>Settings</Text>
                          <Text style={styles.clientSettingsSubtitle}>Profile, preferences, and security.</Text>
                        </View>
                        <View style={styles.clientSettingsHeaderBadge}>
                          <Feather name="shield" size={14} color="#15803d" />
                          <Text style={styles.clientSettingsHeaderBadgeText}>Active</Text>
                        </View>
                      </View>
                      <View style={styles.clientSettingsProfileRow}>
                        <View style={styles.clientSettingsAvatar}>
                          <Text style={styles.clientSettingsAvatarText}>{accountInitials}</Text>
                        </View>
                        <View style={styles.clientSettingsProfileCopy}>
                          <Text style={styles.clientSettingsProfileName}>{currentUser.name}</Text>
                          <Text style={styles.clientSettingsProfileEmail}>{currentUser.email}</Text>
                        </View>
                      </View>
                      <Pressable style={styles.clientSettingsEditButton} onPress={() => setShowProfileEditor((current) => !current)}>
                        <Text style={styles.clientSettingsEditButtonText}>{showProfileEditor ? 'Close profile' : 'Edit profile'}</Text>
                      </Pressable>
                    </View>

                    {showProfileEditor ? (
                      <View style={styles.clientSettingsPanel}>
                        <Text style={styles.clientSettingsPanelTitle}>Edit Profile</Text>
                        <View style={[styles.clientFormGrid, isTablet && styles.clientFormGridWide]}>
                          <View style={[styles.clientFormGridItem, clientSplitFieldStyle]}>
                            <Field label="Name" value={profileForm.name} onChangeText={(value) => setProfileForm((current) => ({ ...current, name: value }))} />
                          </View>
                          <View style={[styles.clientFormGridItem, clientSplitFieldStyle]}>
                            <Field label="Email" value={profileForm.email} onChangeText={(value) => setProfileForm((current) => ({ ...current, email: value }))} />
                          </View>
                          <View style={[styles.clientFormGridItem, clientSplitFieldStyle]}>
                            <Field label="Phone" value={profileForm.phone} onChangeText={(value) => setProfileForm((current) => ({ ...current, phone: value }))} />
                          </View>
                          <View style={[styles.clientFormGridItem, clientSplitFieldStyle]}>
                            <Field label="Date of Birth" value={profileForm.dateOfBirth} onChangeText={(value) => setProfileForm((current) => ({ ...current, dateOfBirth: value }))} />
                          </View>
                          <View style={[styles.clientFormGridItem, clientFullFieldStyle]}>
                            <Field label="Address" value={profileForm.address} multiline onChangeText={(value) => setProfileForm((current) => ({ ...current, address: value }))} />
                          </View>
                        </View>
                        <PrimaryButton label="Save Profile" onPress={() => store.updateProfile(profileForm)} />
                      </View>
                    ) : null}

                    <View style={styles.clientSettingsGroup}>
                      <Text style={styles.clientSettingsGroupLabel}>Preferences</Text>
                      <View style={styles.clientSettingsList}>
                        <SettingsRow icon="bell" label="Notifications and sounds" switchValue={notificationsEnabled} onToggle={setNotificationsEnabled} />
                        <SettingsRow icon="type" label="Language" value={language} onPress={() => setActiveSettingsPanel((current) => current === 'language' ? null : 'language')} />
                        <SettingsRow icon="sun" label="Theme" value={themePreference} onPress={() => setActiveSettingsPanel((current) => current === 'theme' ? null : 'theme')} />
                      </View>
                    </View>

                    {activeSettingsPanel === 'language' ? (
                      <View style={styles.clientSettingsInlinePanel}>
                        <Text style={styles.clientSettingsInlineTitle}>Language</Text>
                        <View style={styles.clientSettingsChoiceRow}>
                          {['English', 'Filipino'].map((option) => {
                            const isActive = language === option;
                            return (
                              <Pressable key={option} style={[styles.clientSettingsChoice, isActive && styles.clientSettingsChoiceActive]} onPress={() => setLanguage(option)}>
                                <Text style={[styles.clientSettingsChoiceText, isActive && styles.clientSettingsChoiceTextActive]}>{option}</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}

                    {activeSettingsPanel === 'theme' ? (
                      <View style={styles.clientSettingsInlinePanel}>
                        <Text style={styles.clientSettingsInlineTitle}>Theme</Text>
                        <View style={styles.clientSettingsChoiceRow}>
                          {['Light', 'System'].map((option) => {
                            const isActive = themePreference === option;
                            return (
                              <Pressable key={option} style={[styles.clientSettingsChoice, isActive && styles.clientSettingsChoiceActive]} onPress={() => setThemePreference(option)}>
                                <Text style={[styles.clientSettingsChoiceText, isActive && styles.clientSettingsChoiceTextActive]}>{option}</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}

                    <View style={styles.clientSettingsGroup}>
                      <Text style={styles.clientSettingsGroupLabel}>Account</Text>
                      <View style={styles.clientSettingsList}>
                        <SettingsRow icon="lock" label="Password" value={showPasswordEditor ? 'Open' : 'Change'} onPress={openPasswordEditor} />
                        <SettingsRow icon="help-circle" label="Support" value="Help Center" onPress={() => setActiveSettingsPanel((current) => current === 'support' ? null : 'support')} />
                        <SettingsRow icon="shield" label="Terms and Privacy Policy" value="View" onPress={() => setActiveSettingsPanel((current) => current === 'terms' ? null : 'terms')} />
                        <SettingsRow icon="log-out" label="Logout" destructive onPress={store.logout} />
                      </View>
                    </View>

                    {activeSettingsPanel === 'support' ? (
                      <View style={styles.clientSettingsInlinePanel}>
                        <Text style={styles.clientSettingsInlineTitle}>Support</Text>
                        <Text style={styles.clientSettingsInlineText}>For account or adoption questions, contact the shelter desk at support@shelter.test.</Text>
                      </View>
                    ) : null}

                    {activeSettingsPanel === 'terms' ? (
                      <View style={styles.clientSettingsInlinePanel}>
                        <Text style={styles.clientSettingsInlineTitle}>Terms and Privacy</Text>
                        <Text style={styles.clientSettingsInlineText}>Your profile details are used for shelter services, adoption records, and account access.</Text>
                      </View>
                    ) : null}

                    {showWorkspaceSwitcher ? (
                      <View style={styles.clientSettingsGroup}>
                        <Text style={styles.clientSettingsGroupLabel}>Workspace</Text>
                        <View style={styles.clientSettingsList}>
                          <SettingsRow icon="user" label="Client" value="Current" onPress={() => setActiveRoleView('public')} />
                          {canSeeAdmin ? <SettingsRow icon="briefcase" label="Admin Workspace" onPress={() => setActiveRoleView('admin')} /> : null}
                          {canSeeDeveloper ? <SettingsRow icon="cpu" label="Developer Workspace" onPress={() => setActiveRoleView('developer')} /> : null}
                        </View>
                      </View>
                    ) : null}

                    {showPasswordEditor ? (
                      <View style={styles.clientSettingsPanel}>
                        <Text style={styles.clientSettingsPanelTitle}>Update Password</Text>
                        <Field label="Current Password" value={passwordForm.currentPassword} secureTextEntry error={passwordForm.currentPassword && !hasCurrentPassword ? 'Enter your current password.' : null} onChangeText={(value) => {
                          setPasswordFeedback(null);
                          setPasswordForm((current) => ({ ...current, currentPassword: value }));
                        }} />
                        <Field label="New Password" value={passwordForm.nextPassword} secureTextEntry error={passwordForm.nextPassword && !hasValidNextPassword ? 'Use at least 8 characters.' : null} onChangeText={(value) => {
                          setPasswordFeedback(null);
                          setPasswordForm((current) => ({ ...current, nextPassword: value }));
                        }} />
                        <Field label="Confirm New Password" value={confirmPassword} secureTextEntry error={confirmPassword && !passwordsMatch ? 'Passwords do not match.' : null} onChangeText={(value) => {
                          setPasswordFeedback(null);
                          setConfirmPassword(value);
                        }} />
                        {passwordFeedback ? (
                          <View style={[styles.clientSettingsPasswordNotice, passwordFeedback.tone === 'success' && styles.clientSettingsPasswordNoticeSuccess, passwordFeedback.tone === 'error' && styles.clientSettingsPasswordNoticeError]}>
                            <Feather name={passwordFeedback.tone === 'success' ? 'check-circle' : 'alert-circle'} size={15} color={passwordFeedback.tone === 'success' ? '#15803d' : '#dc2626'} />
                            <Text style={[styles.clientSettingsPasswordNoticeText, passwordFeedback.tone === 'success' && styles.clientSettingsPasswordNoticeTextSuccess, passwordFeedback.tone === 'error' && styles.clientSettingsPasswordNoticeTextError]}>{passwordFeedback.message}</Text>
                          </View>
                        ) : null}
                        <PrimaryButton label="Update Password" onPress={handlePasswordUpdate} disabled={!canUpdatePassword} />
                      </View>
                    ) : null}

                    <View style={styles.clientSettingsGroup}>
                      <Text style={styles.clientSettingsGroupLabel}>Adoption History</Text>
                      <View style={styles.clientSettingsList}>
                        {currentUserAdoptions.map((adoption) => {
                          const pet = store.pets.find((item) => item.id === adoption.petId);
                          return (
                            <View key={adoption.id} style={styles.clientHistoryRow}>
                              <View style={styles.clientHistoryRowBody}>
                                <Text style={styles.recordTitle}>{pet?.name ?? 'Unknown Pet'}</Text>
                                <Text style={styles.recordMeta}>Submitted {adoption.createdAt.slice(0, 10)}</Text>
                              </View>
                              <StatusBadge label={adoption.status} tone={adoption.status === 'Approved' ? 'success' : adoption.status === 'Rejected' ? 'danger' : 'neutral'} />
                            </View>
                          );
                        })}
                        {currentUserAdoptions.length === 0 ? (
                          <View style={styles.clientSettingsEmptyState}>
                            <Text style={styles.clientSettingsEmptyTitle}>No adoption requests yet</Text>
                            <Text style={styles.clientSettingsEmptyText}>When you submit an adoption application, it will appear here with its latest status.</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={styles.helper}>Login to manage account settings and adoption history.</Text>
                )}
              </View>
            ) : null}
    </>
  );
}

export default function ClientProfileRoute() {
  return <ShelterMobileApp initialRoleView="public" initialPublicSection="account" />;
}
