import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import type React from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { palette } from '@/constants/premium-theme';
import type { PaymentMethod, Pet } from '@/types/shelter';
import { paymentMethodVisuals } from '@/utils/shelter-utils';
import { styles } from '@/constants/styles';

export function Card({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardKicker}>{subtitle}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  multiline,
  secureTextEntry,
  required,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  secureTextEntry?: boolean;
  required?: boolean;
  error?: string | null;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required ? <Text style={styles.fieldLabelRequired}>Required</Text> : null}
      </View>
      <TextInput
        nativeID={label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
        style={[styles.input, multiline && styles.inputMultiline, error && styles.inputError]}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        value={value}
        autoCapitalize="none"
        placeholderTextColor="#a78b7b"
        onChangeText={onChangeText}
      />
      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void | Promise<void>; disabled?: boolean }) {
  return (
    <Pressable style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]} onPress={() => void Promise.resolve(onPress()).catch(() => undefined)} disabled={disabled}>
      <Text style={[styles.primaryButtonText, disabled && styles.primaryButtonTextDisabled]}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void | Promise<void> }) {
  return (
    <Pressable style={styles.secondaryButton} onPress={() => void Promise.resolve(onPress()).catch(() => undefined)}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  switchValue,
  onToggle,
  destructive,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  switchValue?: boolean;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}) {
  const isToggle = typeof switchValue === 'boolean' && Boolean(onToggle);
  const content = (
    <>
      <View style={[styles.clientSettingsRowIcon, destructive && styles.clientSettingsRowIconDanger]}>
        <Feather name={icon} size={16} color={destructive ? '#ef4444' : '#6b7280'} />
      </View>
      <Text style={[styles.clientSettingsRowLabel, destructive && styles.clientSettingsRowLabelDanger]}>{label}</Text>
      {isToggle ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
          trackColor={{ false: '#ead7c6', true: palette.clay }}
          thumbColor="#ffffff"
          ios_backgroundColor="#ead7c6"
        />
      ) : (
        <View style={styles.clientSettingsRowMeta}>
          {value ? <Text style={styles.clientSettingsRowValue}>{value}</Text> : null}
          <Feather name="chevron-right" size={16} color={palette.clayDeep} />
        </View>
      )}
    </>
  );

  if (onPress) {
    return <Pressable style={styles.clientSettingsRow} onPress={onPress}>{content}</Pressable>;
  }

  return <View style={styles.clientSettingsRow}>{content}</View>;
}

export function AdminBottomTab({
  label,
  icon,
  active,
  onPress,
  compact,
  roomy,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  active: boolean;
  onPress: () => void;
  compact?: boolean;
  roomy?: boolean;
}) {
  return (
    <Pressable style={[styles.adminBottomTab, compact && styles.adminBottomTabCompact, roomy && styles.adminBottomTabRoomy]} onPress={onPress}>
      <View style={[styles.adminBottomTabIconBubble, compact && styles.adminBottomTabIconBubbleCompact, roomy && styles.adminBottomTabIconBubbleRoomy, active && styles.adminBottomTabIconBubbleActive]}>
        <Feather name={icon} size={16} color={active ? '#ffffff' : '#94a3b8'} />
      </View>
      {compact ? null : <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86} style={[styles.adminBottomTabText, roomy && styles.adminBottomTabTextRoomy, active && styles.adminBottomTabTextActive]}>{label}</Text>}
    </Pressable>
  );
}

export function AdminSidebarNavItem({
  label,
  description,
  icon,
  tint,
  accent,
  onPress,
  active,
  danger,
}: {
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tint: string;
  accent: string;
  onPress: () => void | Promise<void>;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable style={[styles.adminSidebarItem, active && styles.adminSidebarItemActive, danger && styles.adminSidebarItemDanger]} onPress={() => void Promise.resolve(onPress()).catch(() => undefined)}>
      <View style={[styles.adminSidebarItemIcon, { backgroundColor: tint }]}>
        <Feather name={icon} size={16} color={accent} />
      </View>
      <View style={styles.adminSidebarItemCopy}>
        <Text style={[styles.adminSidebarItemTitle, danger && styles.adminSidebarItemTitleDanger]}>{label}</Text>
        <Text style={styles.adminSidebarItemText}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#cbd5e1" />
    </Pressable>
  );
}

export function AdminMoreMenuItem({
  label,
  description,
  icon,
  tint,
  accent,
  onPress,
}: {
  label: string;
  description: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  tint: string;
  accent: string;
  onPress: () => void | Promise<void>;
}) {
  return (
    <Pressable style={styles.adminMoreMenuItem} onPress={() => void Promise.resolve(onPress()).catch(() => undefined)}>
      <View style={[styles.adminMoreMenuItemIcon, { backgroundColor: tint }]}>
        <Feather name={icon} size={16} color={accent} />
      </View>
      <View style={styles.adminMoreMenuItemCopy}>
        <Text style={styles.adminMoreMenuItemTitle}>{label}</Text>
        <Text style={styles.adminMoreMenuItemText}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#cbd5e1" />
    </Pressable>
  );
}

export function PaymentMethodLogo({ method, active, large, compact }: { method: PaymentMethod; active?: boolean; large?: boolean; compact?: boolean }) {
  const visual = paymentMethodVisuals[method];
  const iconColor = active ? '#ffffff' : visual.accentDeep;
  const shellStyle = [
    styles.clientDonateMethodLogoShell,
    compact && styles.clientDonateMethodLogoShellCompact,
    large && styles.clientDonateMethodLogoShellLarge,
    { backgroundColor: active ? visual.accent : '#ffffff', borderColor: active ? visual.accent : visual.border },
  ];

  if (method === 'gcash') {
    return (
      <View style={[styles.clientDonateMethodLogoShell, compact && styles.clientDonateMethodLogoShellCompact, large && styles.clientDonateMethodLogoShellLarge, styles.clientDonateMethodLogoShellAsset, active && styles.clientDonateMethodLogoShellAssetActive]}>
        <ExpoImage
          source={require('../assets/images/gcash-icon.svg')}
          style={[styles.clientDonateMethodLogoAssetImage, compact && styles.clientDonateMethodLogoAssetImageCompact, large && styles.clientDonateMethodLogoAssetImageLarge]}
          contentFit="contain"
        />
      </View>
    );
  }

  if (method === 'paypal') {
    return (
      <View style={shellStyle}>
        <FontAwesome5 name="paypal" size={large ? 21 : compact ? 13 : 18} color={iconColor} brand />
      </View>
    );
  }

  if (method === 'bank_transfer') {
    return (
      <View style={shellStyle}>
        <FontAwesome5 name="university" size={large ? 19 : compact ? 12 : 17} color={iconColor} solid />
      </View>
    );
  }

  return (
    <View style={shellStyle}>
      <FontAwesome5 name="credit-card" size={large ? 19 : compact ? 12 : 16} color={iconColor} solid />
    </View>
  );
}

export function ClientTab({
  label,
  icon,
  active,
  onPress,
  compact,
  roomy,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  active: boolean;
  onPress: () => void;
  compact?: boolean;
  roomy?: boolean;
}) {
  return (
    <Pressable style={[styles.clientTab, compact && styles.clientTabCompact, roomy && styles.clientTabRoomy, active && styles.clientTabActive]} onPress={onPress}>
      <View style={[styles.clientTabIconBubble, compact && styles.clientTabIconBubbleCompact, roomy && styles.clientTabIconBubbleRoomy, active && styles.clientTabIconBubbleActive]}>
        <Feather name={icon} size={16} color={active ? '#ffffff' : '#9b9086'} />
      </View>
      {compact ? null : <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86} style={[styles.clientTabText, roomy && styles.clientTabTextRoomy, active && styles.clientTabTextActive]}>{label}</Text>}
    </Pressable>
  );
}

export function ClientPetBrowseCard({
  pet,
  active,
  isFavorite,
  onPress,
  onToggleFavorite,
  widthStyle,
  variant,
}: {
  pet: Pet;
  active: boolean;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  widthStyle?: ViewStyle;
  variant?: 'default' | 'home' | 'adopt';
}) {
  const isHomeVariant = variant === 'home';
  const isAdoptVariant = variant === 'adopt';
  return (
    <Pressable style={[styles.clientPetCard, widthStyle, active && styles.clientPetCardActive]} onPress={onPress}>
      <View style={[styles.clientPetMedia, isHomeVariant && styles.clientPetMediaHome, isAdoptVariant && styles.clientPetMediaAdopt]}>
        <View style={styles.clientPetMediaTop}>
          <View style={styles.clientPetMediaBadge}>
            <Text style={styles.clientPetMediaBadgeText}>{pet.status}</Text>
          </View>
          <Pressable style={[styles.clientPetFavoriteButton, isFavorite && styles.clientPetFavoriteButtonActive]} onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}>
            <FontAwesome5 name="heart" size={14} color={isFavorite ? '#ffffff' : palette.clay} solid={isFavorite} />
          </Pressable>
        </View>
        <View style={styles.clientPetMediaCenter}>
          <View style={[styles.clientPetMediaIconWrap, isHomeVariant && styles.clientPetMediaIconWrapHome, isAdoptVariant && styles.clientPetMediaIconWrapAdopt]}>
            <FontAwesome5 name={pet.species === 'Dog' ? 'dog' : pet.species === 'Cat' ? 'cat' : 'paw'} size={isHomeVariant ? 42 : isAdoptVariant ? 48 : 34} color="#ffffff" />
          </View>
        </View>
      </View>
      <View style={[styles.clientPetCardBody, isHomeVariant && styles.clientPetCardBodyHome, isAdoptVariant && styles.clientPetCardBodyAdopt]}>
        <Text style={[styles.clientPetName, isHomeVariant && styles.clientPetNameHome, isAdoptVariant && styles.clientPetNameAdopt]}>{pet.name}</Text>
        <Text style={[styles.clientPetBreed, isHomeVariant && styles.clientPetBreedHome, isAdoptVariant && styles.clientPetBreedAdopt]}>{pet.breed}</Text>
        {isAdoptVariant ? <Text style={styles.clientPetLocation}>Ready to meet through the shelter adoption team</Text> : null}
        <View style={styles.clientPetMetaRow}>
          <Text style={styles.clientPetMeta}>{pet.gender}</Text>
          <Text style={styles.clientPetMeta}>{pet.size}</Text>
          <Text style={styles.clientPetMeta}>{pet.age} years</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function AdminPetDirectoryItem({ pet, active, onPress }: { pet: Pet; active: boolean; onPress: () => void }) {
  const iconName = pet.species === 'Dog' ? 'dog' : pet.species === 'Cat' ? 'cat' : 'paw';
  const thumbColor = pet.species === 'Dog' ? '#ffe1cf' : pet.species === 'Cat' ? '#ffead9' : '#fff3e8';
  const statusToneStyle = pet.status === 'Available'
    ? styles.adminPetDirectoryStatusAvailable
    : pet.status === 'Fostered'
      ? styles.adminPetDirectoryStatusFostered
      : pet.status === 'Sick'
        ? styles.adminPetDirectoryStatusAlert
        : styles.adminPetDirectoryStatusPending;

  return (
    <Pressable style={[styles.adminPetDirectoryItem, active && styles.adminPetDirectoryItemActive]} onPress={onPress}>
      <View style={[styles.adminPetDirectoryThumb, { backgroundColor: thumbColor }]}>
        <View style={styles.adminPetDirectoryThumbGlow} />
        <FontAwesome5 name={iconName} size={28} color={palette.clayDeep} />
      </View>
      <View style={styles.adminPetDirectoryItemCopy}>
        <Text style={styles.adminPetDirectoryItemName}>{pet.name}</Text>
        <Text style={styles.adminPetDirectoryItemBreed}>{pet.breed} | {pet.age}y</Text>
        <Text style={styles.adminPetDirectoryItemMeta}>{pet.gender} | {pet.size}</Text>
        <View style={[styles.adminPetDirectoryStatusPill, statusToneStyle]}>
          <Text style={styles.adminPetDirectoryStatusText}>{pet.status}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color="#cbd5e1" />
    </Pressable>
  );
}

export function StatusBadge({ label, tone }: { label: string; tone: 'neutral' | 'success' | 'danger' }) {
  return (
    <View style={[styles.statusBadge, tone === 'success' && styles.statusBadgeSuccess, tone === 'danger' && styles.statusBadgeDanger]}>
      <Text style={[styles.statusBadgeText, tone === 'success' && styles.statusBadgeTextSuccess, tone === 'danger' && styles.statusBadgeTextDanger]}>{label}</Text>
    </View>
  );
}

export function DetailRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <View style={styles.petDetailsRow}>
      <Text style={styles.petDetailsRowLabel}>{label}</Text>
      <Text style={[styles.petDetailsRowValue, positive && styles.petDetailsRowValuePositive]}>{value}</Text>
    </View>
  );
}

export function AuthLink({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.authLink, active && styles.authLinkActive]} onPress={onPress}>
      <Text style={[styles.authLinkText, active && styles.authLinkTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function DangerButton({ label, onPress }: { label: string; onPress: () => void | Promise<void> }) {
  return (
    <Pressable style={styles.dangerButton} onPress={() => void Promise.resolve(onPress()).catch(() => undefined)}>
      <Text style={styles.dangerButtonText}>{label}</Text>
    </Pressable>
  );
}

export function RolePill({
  label,
  active,
  onPress,
  disabled,
  compact,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable style={[styles.pill, active && styles.pillActive, disabled && styles.pillDisabled, compact && styles.pillCompact]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function Toggle({ label, value, onPress }: { label: string; value: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.toggleRow} onPress={onPress}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.recordMeta}>{value ? 'On' : 'Off'}</Text>
    </Pressable>
  );
}
