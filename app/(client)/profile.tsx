import { ShelterMobileApp } from '@/components/AppShell';
import { Pressable, Text, View } from 'react-native';
import { Field, PrimaryButton, SettingsRow, StatusBadge } from '@/components';
import { styles } from '@/constants/styles';
import { useShelterAppContext } from '@/hooks/useShelterAppContext';

export function ClientAccountPage() {
  const {
    store,
    setActiveRoleView,
    activePublicSection,
    notificationsEnabled,
    setNotificationsEnabled,
    faceIdEnabled,
    setFaceIdEnabled,
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

  return (
    <>
            {activePublicSection === 'account' ? (
              <View style={styles.clientSettingsScreen}>
                {currentUser ? (
                  <>
                    <View style={styles.clientSettingsHero}>
                      <View style={styles.clientSettingsHeroTop}>
                        <Text style={styles.clientSettingsTitle}>Settings</Text>
                        <Text style={styles.clientSettingsSubtitle}>Manage your profile, preferences, and account access.</Text>
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
                        <SettingsRow icon="type" label="Language" value="English" />
                        <SettingsRow icon="sun" label="Theme" value="Light" />
                      </View>
                    </View>

                    <View style={styles.clientSettingsGroup}>
                      <Text style={styles.clientSettingsGroupLabel}>Account</Text>
                      <View style={styles.clientSettingsList}>
                        <SettingsRow icon="lock" label="Password" value={showPasswordEditor ? 'Open' : 'Change'} onPress={() => setShowPasswordEditor((current) => !current)} />
                        <SettingsRow icon="smartphone" label="Login with Face ID" switchValue={faceIdEnabled} onToggle={setFaceIdEnabled} />
                        <SettingsRow icon="help-circle" label="Support" value="Help Center" />
                        <SettingsRow icon="shield" label="Terms and Privacy Policy" />
                        <SettingsRow icon="log-out" label="Logout" destructive onPress={store.logout} />
                      </View>
                    </View>

                    {showWorkspaceSwitcher ? (
                      <View style={styles.clientSettingsGroup}>
                        <Text style={styles.clientSettingsGroupLabel}>Workspace</Text>
                        <View style={styles.clientSettingsList}>
                          <SettingsRow icon="user" label="Client" value="Current" />
                          {canSeeAdmin ? <SettingsRow icon="briefcase" label="Admin Workspace" onPress={() => setActiveRoleView('admin')} /> : null}
                          {canSeeDeveloper ? <SettingsRow icon="cpu" label="Developer Workspace" onPress={() => setActiveRoleView('developer')} /> : null}
                        </View>
                      </View>
                    ) : null}

                    {showPasswordEditor ? (
                      <View style={styles.clientSettingsPanel}>
                        <Text style={styles.clientSettingsPanelTitle}>Update Password</Text>
                        <Field label="Current Password" value={passwordForm.currentPassword} secureTextEntry onChangeText={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))} />
                        <Field label="New Password" value={passwordForm.nextPassword} secureTextEntry onChangeText={(value) => setPasswordForm((current) => ({ ...current, nextPassword: value }))} />
                        <PrimaryButton label="Update Password" onPress={() => store.changePassword(passwordForm.currentPassword, passwordForm.nextPassword)} />
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
