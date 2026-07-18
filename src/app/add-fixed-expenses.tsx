import {
    FixedExpense,
    FixedExpenseCategory,
    addFixedExpense,
    deleteFixedExpense,
    getFixedExpenses,
    updateFixedExpense,
} from '@/storage/expenses';
import { colors, globalStyles } from '@/styles/global';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
  
  const fixedCategories: {
    label: string;
    value: FixedExpenseCategory;
  }[] = [
    { label: 'Rent', value: 'rent' },
    { label: 'Council Tax', value: 'councilTax' },
    { label: 'Energy', value: 'energy' },
    { label: 'Internet', value: 'internet' },
    { label: 'Phone', value: 'phone' },
    { label: 'Insurance', value: 'insurance' },
    { label: 'Other', value: 'other' },
  ];
  
  const bankOptions = [
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
  
  export default function AddFixedExpensesScreen() {
    const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  
    const [modalVisible, setModalVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(
      null,
    );
  
    const [name, setName] = useState('');
    const [category, setCategory] =
      useState<FixedExpenseCategory>('councilTax');
    const [customCategoryName, setCustomCategoryName] = useState('');
  
    const [monthlyAmount, setMonthlyAmount] = useState('');
  
    const [paymentMethod, setPaymentMethod] = useState<
      'directDebit' | 'manual'
    >('directDebit');
  
    const [paymentDayOfMonth, setPaymentDayOfMonth] = useState('');
  
    const [accountType, setAccountType] = useState<'bank' | 'card'>('bank');
  
    const [bankNameOption, setBankNameOption] = useState('Barclays');
    const [customBankName, setCustomBankName] = useState('');
  
    const [cardNameOption, setCardNameOption] = useState('Amex');
    const [customCardName, setCustomCardName] = useState('');
  
    const loadFixedExpenses = async () => {
      const data = await getFixedExpenses();
      setFixedExpenses(data);
    };
  
    useFocusEffect(
      useCallback(() => {
        loadFixedExpenses();
      }, []),
    );
  
    const formatCurrency = (amount?: number) => {
      return Number(amount || 0).toLocaleString('en-GB');
    };
  
    const getCategoryLabel = (expense: FixedExpense) => {
      if (expense.category === 'other' && expense.customCategoryName) {
        return expense.customCategoryName;
      }
  
      return (
        fixedCategories.find((item) => item.value === expense.category)?.label ||
        'Other'
      );
    };
  
    const getFinalAccountName = () => {
      if (accountType === 'bank') {
        return bankNameOption === 'Other'
          ? customBankName.trim()
          : bankNameOption;
      }
  
      return cardNameOption === 'Other'
        ? customCardName.trim()
        : cardNameOption;
    };
  
    const resetForm = () => {
      setEditingExpense(null);
  
      setName('');
      setCategory('councilTax');
      setCustomCategoryName('');
      setMonthlyAmount('');
  
      setPaymentMethod('directDebit');
      setPaymentDayOfMonth('');
  
      setAccountType('bank');
  
      setBankNameOption('Barclays');
      setCustomBankName('');
  
      setCardNameOption('Amex');
      setCustomCardName('');
    };
  
    const openAddModal = () => {
      resetForm();
      setModalVisible(true);
    };
  
    const openEditModal = (expense: FixedExpense) => {
      setEditingExpense(expense);
  
      setName(expense.name);
      setCategory(expense.category);
      setCustomCategoryName(expense.customCategoryName || '');
      setMonthlyAmount(String(expense.monthlyAmount));
  
      setPaymentMethod(expense.paymentMethod || 'directDebit');
      setPaymentDayOfMonth(
        expense.paymentDayOfMonth ? String(expense.paymentDayOfMonth) : '',
      );
  
      setAccountType(expense.accountType);
  
      if (expense.accountType === 'bank') {
        if (expense.bankName && bankOptions.includes(expense.bankName)) {
          setBankNameOption(expense.bankName);
          setCustomBankName('');
        } else {
          setBankNameOption('Other');
          setCustomBankName(expense.bankName || '');
        }
  
        setCardNameOption('Amex');
        setCustomCardName('');
      } else {
        if (
          expense.bankName &&
          creditCardOptions.includes(expense.bankName)
        ) {
          setCardNameOption(expense.bankName);
          setCustomCardName('');
        } else {
          setCardNameOption('Other');
          setCustomCardName(expense.bankName || '');
        }
  
        setBankNameOption('Barclays');
        setCustomBankName('');
      }
  
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      resetForm();
    };
  
    const handleSaveFixedExpense = async () => {
      const cleanName = name.trim();
      const cleanCustomCategoryName = customCategoryName.trim();
      const amountValue = Number(monthlyAmount) || 0;
      const directDebitDayValue = Number(paymentDayOfMonth) || 0;
      const finalAccountName = getFinalAccountName();
  
      if (!cleanName) {
        Alert.alert('Error', 'Please enter expense name.');
        return;
      }
  
      if (amountValue <= 0) {
        Alert.alert('Error', 'Monthly amount must be greater than 0.');
        return;
      }
  
      if (category === 'other' && !cleanCustomCategoryName) {
        Alert.alert('Error', 'Please enter other category name.');
        return;
      }
  
      if (paymentMethod === 'directDebit') {
        if (!paymentDayOfMonth.trim()) {
          Alert.alert('Error', 'Please enter direct debit day.');
          return;
        }
  
        if (directDebitDayValue < 1 || directDebitDayValue > 31) {
          Alert.alert('Error', 'Direct debit day must be between 1 and 31.');
          return;
        }
      }
  
      if (!finalAccountName) {
        Alert.alert('Error', 'Please select or enter account name.');
        return;
      }
  
      if (editingExpense) {
        const updatedExpense: FixedExpense = {
          ...editingExpense,
  
          name: cleanName,
          category,
          customCategoryName:
            category === 'other' ? cleanCustomCategoryName : undefined,
  
          monthlyAmount: amountValue,
          paymentMethod,
          paymentDayOfMonth:
            paymentMethod === 'directDebit' ? directDebitDayValue : undefined,
  
          accountType,
          bankName: finalAccountName,
  
          isActive: 'yes',
        };
  
        await updateFixedExpense(updatedExpense);
      } else {
        await addFixedExpense({
          name: cleanName,
          category,
          customCategoryName:
            category === 'other' ? cleanCustomCategoryName : undefined,
  
          monthlyAmount: amountValue,
          paymentMethod,
          paymentDayOfMonth:
            paymentMethod === 'directDebit' ? directDebitDayValue : undefined,
  
          accountType,
          bankName: finalAccountName,
  
          isActive: 'yes',
        });
      }
  
      await loadFixedExpenses();
      closeModal();
    };
  
    const handleDeleteFixedExpense = async (expense: FixedExpense) => {
      Alert.alert(
        'Delete Fixed Expense',
        `Are you sure you want to delete "${expense.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteFixedExpense(expense.id);
              await loadFixedExpenses();
  
              if (editingExpense?.id === expense.id) {
                closeModal();
              }
            },
          },
        ],
      );
    };
  
    return (
      <ScrollView
        style={globalStyles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>Fixed Expenses</Text>
  
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+ Add Fixed Expense</Text>
        </TouchableOpacity>
  
        <Text style={styles.sectionTitle}>Monthly Bills</Text>
  
        {fixedExpenses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No fixed expenses yet</Text>
  
            <Text style={styles.emptyText}>
              Add your monthly bills such as rent, council tax, energy,
              internet, phone or insurance.
            </Text>
          </View>
        ) : (
          fixedExpenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              style={styles.expenseCard}
              onPress={() => openEditModal(expense)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.cardTitleWrap}>
                  <Text style={styles.expenseName} numberOfLines={1}>
                    {expense.name}
                  </Text>
  
                  <Text style={styles.expenseMeta} numberOfLines={1}>
                    {getCategoryLabel(expense)}
                    {expense.paymentMethod === 'directDebit' &&
                    expense.paymentDayOfMonth
                      ? ` · Direct Debit day ${expense.paymentDayOfMonth}`
                      : ' · Manual payment'}
                  </Text>
  
                  <Text style={styles.expenseMetaSmall} numberOfLines={1}>
                    {expense.accountType === 'bank' ? 'Bank' : 'Credit Card'}
                    {expense.bankName ? ` · ${expense.bankName}` : ''}
                  </Text>
                </View>
  
                <View style={styles.cardRight}>
                  <Text style={styles.expenseAmount}>
                    £{formatCurrency(expense.monthlyAmount)}
                  </Text>
  
                  <Text style={styles.expenseAmountLabel}>monthly</Text>
                </View>
              </View>
  
              <View style={styles.cardBottomRow}>
                <Text style={styles.editHint}>Tap to edit</Text>
  
                <TouchableOpacity
                  onPress={() => handleDeleteFixedExpense(expense)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
  
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editingExpense ? 'Edit Fixed Expense' : 'Add Fixed Expense'}
                  </Text>
  
                  <TouchableOpacity onPress={closeModal}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
  
                <Text style={styles.modalSectionTitle}>Details</Text>
  
                <Text style={styles.fieldLabel}>Name</Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Council Tax, Octopus Energy, Internet"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
  
                <Text style={styles.fieldLabelWithMargin}>Monthly amount</Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="£0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={monthlyAmount}
                  onChangeText={setMonthlyAmount}
                />
  
                <Text style={styles.modalSectionTitle}>Category</Text>
  
                <View style={styles.chipRow}>
                  {fixedCategories.map((item) => (
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
  
                <Text style={styles.modalSectionTitle}>Payment method</Text>
  
                <View style={styles.optionRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      paymentMethod === 'directDebit' &&
                        styles.optionButtonActive,
                    ]}
                    onPress={() => setPaymentMethod('directDebit')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        paymentMethod === 'directDebit' &&
                          styles.optionTextActive,
                      ]}
                    >
                      Direct Debit
                    </Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      paymentMethod === 'manual' && styles.optionButtonActive,
                    ]}
                    onPress={() => setPaymentMethod('manual')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        paymentMethod === 'manual' &&
                          styles.optionTextActive,
                      ]}
                    >
                      Manual
                    </Text>
                  </TouchableOpacity>
                </View>
  
                {paymentMethod === 'directDebit' && (
                  <>
                    <Text style={styles.fieldLabelWithMargin}>
                      Direct debit day
                    </Text>
  
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 1, 15, 28, 31"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      value={paymentDayOfMonth}
                      onChangeText={setPaymentDayOfMonth}
                    />
  
                    <Text style={styles.helperText}>
                      If the selected day does not exist in a month, it will be
                      treated as the last day of that month.
                    </Text>
                  </>
                )}
  
                <Text style={styles.modalSectionTitle}>Payment account</Text>
  
                <View style={styles.optionRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      accountType === 'bank' && styles.optionButtonActive,
                    ]}
                    onPress={() => setAccountType('bank')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        accountType === 'bank' && styles.optionTextActive,
                      ]}
                    >
                      Bank
                    </Text>
                  </TouchableOpacity>
  
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      accountType === 'card' && styles.optionButtonActive,
                    ]}
                    onPress={() => setAccountType('card')}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        accountType === 'card' && styles.optionTextActive,
                      ]}
                    >
                      Credit Card
                    </Text>
                  </TouchableOpacity>
                </View>
  
                {accountType === 'bank' && (
                  <View style={styles.accountOptionsBox}>
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
                              bankNameOption === bank &&
                                styles.chipTextActive,
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
                  </View>
                )}
  
                {accountType === 'card' && (
                  <View style={styles.accountOptionsBox}>
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
                              cardNameOption === card &&
                                styles.chipTextActive,
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
                  </View>
                )}
  
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveFixedExpense}
                >
                  <Text style={styles.saveButtonText}>
                    {editingExpense ? 'Save Changes' : 'Save Fixed Expense'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
  
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 16,
    },
  
    addButtonText: {
      color: colors.background,
      fontSize: 17,
      fontWeight: '800',
    },
  
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '800',
      marginTop: 24,
      marginBottom: 12,
    },
  
    emptyCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
    },
  
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 8,
    },
  
    emptyText: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
  
    expenseCard: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
    },
  
    cardTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
  
    cardTitleWrap: {
      flex: 1,
      marginRight: 12,
    },
  
    expenseName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
  
    expenseMeta: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 6,
      fontWeight: '600',
    },
  
    expenseMetaSmall: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
  
    cardRight: {
      alignItems: 'flex-end',
    },
  
    expenseAmount: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: '900',
    },
  
    expenseAmountLabel: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 3,
    },
  
    cardBottomRow: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.background,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    editHint: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
  
    deleteText: {
      color: '#ff6b6b',
      fontSize: 14,
      fontWeight: '700',
    },
  
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      padding: 18,
    },
  
    modalBox: {
      backgroundColor: colors.background,
      borderRadius: 22,
      padding: 18,
      maxHeight: '88%',
    },
  
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    modalTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: '900',
    },
  
    modalCloseText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: '700',
    },
  
    modalSectionTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '800',
      marginTop: 20,
      marginBottom: 10,
    },
  
    fieldLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 7,
    },
  
    fieldLabelWithMargin: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 14,
      marginBottom: 7,
    },
  
    input: {
      backgroundColor: colors.surface,
      color: colors.text,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 15,
      fontSize: 16,
    },
  
    helperText: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 8,
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
  
    optionRow: {
      flexDirection: 'row',
      gap: 10,
    },
  
    optionButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 13,
      alignItems: 'center',
    },
  
    optionButtonActive: {
      backgroundColor: colors.primary,
    },
  
    optionText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: '800',
    },
  
    optionTextActive: {
      color: colors.background,
    },
  
    accountOptionsBox: {
      marginTop: 12,
    },
  
    customInput: {
      marginTop: 10,
    },
  
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 4,
    },
  
    saveButtonText: {
      color: colors.background,
      fontSize: 17,
      fontWeight: '800',
    },
  });