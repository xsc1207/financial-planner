import { colors } from '@/styles/global';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RecentLoanPaymentItemsProps = {
  id: string;
  name: string;
  loanName: string;
  value: string;
  regularPaymentAmount?: number;
  extraPaymentAmount?: number;
  date?: string;
  accountType?: 'cash' | 'bank';
  bankName?: string;
  isExtraPayment?: 'yes' | 'no';
  onDelete: (id: string) => void;
};

export default function RecentLoanPaymentItems({
  id,
  loanName,
  value,
  regularPaymentAmount = 0,
  extraPaymentAmount = 0,
  date,
  accountType,
  bankName,
  isExtraPayment = 'no',
  onDelete,
}: RecentLoanPaymentItemsProps) {
  const formatDate = (date?: string) => {
    if (!date) return 'No date';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount?: number | string) => {
    return Number(amount || 0).toLocaleString('en-GB');
  };

  const accountText =
    accountType === 'bank'
      ? bankName || 'Bank'
      : accountType === 'cash'
        ? 'Cash'
        : '';

  return (
    <TouchableOpacity
      style={styles.card}
      onLongPress={() => {
        Alert.alert(
          'Delete Payment',
          `Are you sure you want to delete "${loanName}" payment?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => onDelete(id),
            },
          ],
        );
      }}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.name} numberOfLines={1}>
            {loanName}
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            {formatDate(date)}
            {accountText ? ` · ${accountText}` : ''}
          </Text>
        </View>

        <View style={styles.rightWrap}>
          <Text style={styles.totalValue}>£{formatCurrency(value)}</Text>
          {isExtraPayment === 'yes' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Extra</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Regular</Text>
          <Text style={styles.infoAmount}>
            £{formatCurrency(regularPaymentAmount)}
          </Text>
        </View>

        <View style={styles.dot} />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Extra</Text>
          <Text style={styles.infoAmount}>
            £{formatCurrency(extraPaymentAmount)}
          </Text>
        </View>

        <View style={styles.dot} />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Total</Text>
          <Text style={styles.infoAmountPrimary}>
            £{formatCurrency(value)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 12,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titleWrap: {
    flex: 1,
    marginRight: 12,
  },

  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },

  meta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  rightWrap: {
    alignItems: 'flex-end',
  },

  totalValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },

  badge: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  badgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '800',
  },

  infoRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },

  infoAmount: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  infoAmountPrimary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
    marginHorizontal: 8,
  },
});