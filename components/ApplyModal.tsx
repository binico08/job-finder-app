import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Job } from '../screens/JobFinderScreen';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ApplyModalProps {
  visible: boolean;
  onClose: () => void;
  job: Job | null;
  fromSavedJobs?: boolean;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ visible, onClose, job, fromSavedJobs }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; contact?: string; reason?: string }>({});

  const validateFields = () => {
    let newErrors: { name?: string; email?: string; contact?: string; reason?: string } = {};

    if (!name) newErrors.name = 'Required';
    if (!email) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(email) || !email.endsWith('.com')) {
      newErrors.email = 'Invalid Email (must contain "@" and end with ".com")';
    }
    if (!contact) {
      newErrors.contact = 'Required';
    } else if (!/^09\d{9}$/.test(contact)) {
      newErrors.contact = 'Invalid Contact (must start with 09 and be 11 digits)';
    }
    if (!reason) newErrors.reason = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = () => {
    if (!validateFields()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowFeedback(true);
    }, 1500);
  };

  const handleFeedbackClose = () => {
    setName('');
    setEmail('');
    setContact('');
    setReason('');
    setShowFeedback(false);
    onClose();
    if (fromSavedJobs) {
      navigation.navigate('JobFinderScreen');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}>
          {showFeedback ? (
            <View style={styles.feedbackContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#28A745" />
              <Text style={[styles.feedbackTitle, { color: theme.text }]}>Application Submitted!</Text>
              <Text style={[styles.feedbackText, { color: theme.text, textAlign: 'center' }]}>
                Your application for {job?.title} at {job?.companyName} has been submitted.
              </Text>
              <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackClose}>
                <Text style={styles.buttonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={[styles.modalTitle, { color: theme.text, textAlign: 'center' }]}>Apply for Job</Text>
              {job && (
                <View style={styles.jobInfoContainer}>
                  <Text style={[styles.jobTitle, { color: theme.text, textAlign: 'center' }]}>{job.title}</Text>
                  <Text style={[styles.companyName, { color: theme.text, textAlign: 'center' }]}>{job.companyName}</Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: errors.name ? 'red' : '#ccc' }]}
                  placeholder="Full Name *"
                  placeholderTextColor={errors.name ? 'red' : theme.placeholder}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: errors.email ? 'red' : '#ccc' }]}
                  placeholder="Email *"
                  placeholderTextColor={errors.email ? 'red' : theme.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: errors.contact ? 'red' : '#ccc' }]}
                  placeholder="Contact Number *"
                  placeholderTextColor={errors.contact ? 'red' : theme.placeholder}
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.textArea, { color: theme.text, borderColor: errors.reason ? 'red' : '#ccc' }]}
                  placeholder="Why should we hire you? *"
                  placeholderTextColor={errors.reason ? 'red' : theme.placeholder}
                  value={reason}
                  onChangeText={setReason}
                  multiline
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleApply} disabled={isSubmitting}>
                  {isSubmitting ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.buttonText}>Submit</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isSubmitting}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', padding: 20, borderRadius: 10 },
  scrollContainer: { paddingBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  jobInfoContainer: { marginBottom: 20, padding: 15, borderRadius: 8, borderWidth: 1 },
  jobTitle: { fontSize: 18, fontWeight: 'bold' },
  companyName: { fontSize: 16 },
  inputContainer: { marginBottom: 15 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderRadius: 5 },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { marginTop: 10 },
  submitButton: { padding: 15, borderRadius: 5, alignItems: 'center', backgroundColor: '#28A745', marginBottom: 10 },
  cancelButton: { padding: 15, borderRadius: 5, alignItems: 'center', backgroundColor: '#FF3B30' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  feedbackContainer: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  feedbackTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
  feedbackText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

export default ApplyModal;