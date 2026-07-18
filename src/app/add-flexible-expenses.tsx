import {
    FlexibleExpenseCategory,
    addFlexibleExpense,
} from '@/storage/expenses';
import { colors, globalStyles } from '@/styles/global';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
  
  const flexibleCategories: {
    label: string;
    value: FlexibleExpenseCategory;
  }[] = [
    { label: 'Groceries', value: 'groceries' },
    { label: 'Eating Out', value: 'eatingOut' },
    { label: 'Transport', value: 'transport' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Baby / Child', value: 'baby' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Health', value: 'health' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Home', value: 'home' },
    { label: 'Other', value: 'other' },
  ];
  
  const bankOptions = [
    'Revolut',
    'Barclays',
    'HSBC',
    'Lloyds',
    'NatWest',
    'Santander',
    'Other',
  ];
  
  const creditCardOptions = [
    'Amex',
    'Barclaycard',
    'HSBC Credit Card',
    'Lloyds Credit Card',
    'Other',
  ];
  
  export default function AddFlexibleExpensesScreen() {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
  
    const [date, setDate] = useState(new Date().toISOString());
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const [category, setCategory] =
      useState<FlexibleExpenseCategory>('groceries');
  
    const [customCategoryName, setCustomCategoryName] = useState('');
  
    const [accountType, setAccountType] = useState<'bank' | 'card' | 'cash'>(
      'bank',
    );
  
    const [bankNameOption, setBankNameOption] = useState('Barclays');
    const [customBankName, setCustomBankName] = useState('');
  
    const [cardNameOption, setCardNameOption] = useState('Amex');
    const [customCardName, setCustomCardName] = useState('');
  
    const amountValue = Number(value) || 0;
  
    const formatDisplayDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };
  
    const getFinalAccountName = () => {
      if (accountType === 'cash') return undefined;
  
      if (accountType === 'bank') {
        return bankNameOption === 'Other'
          ? customBankName.trim()
          : bankNameOption;
      }
  
      return cardNameOption === 'Other'
        ? customCardName.trim()
        : cardNameOption;
    };
  
    const handleSaveExpense = async () => {
      const cleanName = name.trim();
      const cleanCustomCategoryName = customCategoryName.trim();
  
      if (!cleanName) {
        Alert.alert('Error', 'Please enter expense name.');
        return;
      }
  
      if (amountValue <= 0) {
        Alert.alert('Error', 'Amount must be greater than 0.');
        return;
      }
  
      if (category === 'other' && !cleanCustomCategoryName) {
        Alert.alert('Error', 'Please enter other category name.');
        return;
      }
  
      const finalAccountName = getFinalAccountName();
  
      if (accountType !== 'cash' && !finalAccountName) {
        Alert.alert('Error', 'Please select or enter account name.');
        return;
      }
  
      await addFlexibleExpense({
        name: cleanName,
        category,
        customCategoryName:
          category === 'other' ? cleanCustomCategoryName : undefined,
        value: amountValue,
        date,
        accountType,
        bankName: finalAccountName,
      });
  
      Alert.alert('Success', 'Expense added successfully!');
  
      router.back();
    };
  
    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>Add Flexible Expense</Text>
  
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
  
        <Text style={styles.sectionTitle}>Details</Text>
  
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Name</Text>
  
          <TextInput
            style={styles.input}
            placeholder="e.g. Tesco, McDonald's, Petrol"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
  
          <View style={styles.amountDateRow}>
            <View style={styles.amountBox}>
              <Text style={styles.fieldLabel}>Amount</Text>
  
              <TextInput
                style={styles.input}
                placeholder="£0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
              />
            </View>
  
            <View style={styles.dateBoxWrapper}>
              <Text style={styles.fieldLabel}>Date</Text>
  
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setShowDatePicker(!showDatePicker)}
              >
                <Text style={styles.dateText}>{formatDisplayDate(date)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
  
        {showDatePicker && (
          <View style={styles.datePickerBox}>
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor="#ffffff"
              themeVariant="dark"
              onChange={(_event, selectedDate) => {
                if (!selectedDate) return;
  
                setDate(selectedDate.toISOString());
  
                if (Platform.OS !== 'ios') {
                  setShowDatePicker(false);
                }
              }}
            />
  
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
  
        <Text style={styles.sectionTitle}>Category</Text>
  
        <View style={styles.chipRow}>
          {flexibleCategories.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.chip,
                category === item.value && styles.chipActive,
              ]}
              onPress={() => setCategory(item.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  category === item.value && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {category === 'other' && (
          <TextInput
            style={[styles.input, styles.customInput]}
            placeholder="Enter category name"
            placeholderTextColor={colors.textSecondary}
            value={customCategoryName}
            onChangeText={setCustomCategoryName}
          />
        )}
  
        <Text style={styles.sectionTitle}>Payment account</Text>
  
        <View style={styles.accountTypeRow}>
          {(['bank', 'card', 'cash'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.accountTypeButton,
                accountType === type && styles.accountTypeButtonActive,
              ]}
              onPress={() => setAccountType(type)}
            >
              <Text
                style={[
                  styles.accountTypeText,
                  accountType === type && styles.accountTypeTextActive,
                ]}
              >
                {type === 'bank'
                  ? 'Bank'
                  : type === 'card'
                    ? 'Credit Card'
                    : 'Cash'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        {accountType === 'bank' && (
          <>
            <View style={styles.chipRow}>
              {bankOptions.map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={[
                    styles.chip,
                    bankNameOption === bank && styles.chipActive,
                  ]}
                  onPress={() => setBankNameOption(bank)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      bankNameOption === bank && styles.chipTextActive,
                    ]}
                  >
                    {bank}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
  
            {bankNameOption === 'Other' && (
              <TextInput
                style={[styles.input, styles.customInput]}
                placeholder="Enter bank name"
                placeholderTextColor={colors.textSecondary}
                value={customBankName}
                onChangeText={setCustomBankName}
              />
            )}
          </>
        )}
  
        {accountType === 'card' && (
          <>
            <View style={styles.chipRow}>
              {creditCardOptions.map((card) => (
                <TouchableOpacity
                  key={card}
                  style={[
                    styles.chip,
                    cardNameOption === card && styles.chipActive,
                  ]}
                  onPress={() => setCardNameOption(card)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      cardNameOption === card && styles.chipTextActive,
                    ]}
                  >
                    {card}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
  
            {cardNameOption === 'Other' && (
              <TextInput
                style={[styles.input, styles.customInput]}
                placeholder="Enter credit card name"
                placeholderTextColor={colors.textSecondary}
                value={customCardName}
                onChangeText={setCustomCardName}
              />
            )}
          </>
        )}
  
        {accountType === 'cash' && (
          <View style={styles.cashInfoCard}>
            <Text style={styles.cashInfoText}>
              This expense will be recorded as cash spending.
            </Text>
          </View>
        )}
  
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveExpense}>
          <Text style={styles.saveButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    content: {
      paddingBottom: 34,
    },
  
    backButton: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      marginTop: 20,
      marginBottom: 10,
    },
  
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
  
    chip: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      paddingVertical: 9,
      paddingHorizontal: 13,
    },
  
    chipActive: {
      backgroundColor: colors.primary,
    },
  
    chipText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '700',
    },
  
    chipTextActive: {
      color: colors.background,
    },
  
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
    },
  
    fieldLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 7,
    },
  
    input: {
      backgroundColor: colors.background,
      color: colors.text,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 15,
      fontSize: 16,
    },
  
    amountDateRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 14,
    },
  
    amountBox: {
      flex: 1,
    },
  
    dateBoxWrapper: {
      flex: 1,
    },
  
    dateBox: {
      backgroundColor: colors.background,
      borderRadius: 15,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
  
    dateText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },
  
    datePickerBox: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 12,
      marginTop: 10,
    },
  
    doneButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
    },
  
    doneButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '700',
    },
  
    accountTypeRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
    },
  
    accountTypeButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 13,
      alignItems: 'center',
    },
  
    accountTypeButtonActive: {
      backgroundColor: colors.primary,
    },
  
    accountTypeText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: '800',
    },
  
    accountTypeTextActive: {
      color: colors.background,
    },
  
    customInput: {
      marginTop: 10,
    },
  
    cashInfoCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,
    },
  
    cashInfoText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '600',
    },
  
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 24,
    },
  
    saveButtonText: {
      color: colors.background,
      fontSize: 17,
      fontWeight: '800',
    },
  });