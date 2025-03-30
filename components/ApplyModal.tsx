import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
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

  const handleApply = () => {
    if (!name || !email || !contact || !reason) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

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
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}> 
        <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}> 
          {showFeedback ? (
            <View style={styles.feedbackContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#28A745" />
              <Text style={[styles.feedbackTitle, { color: theme.text }]}>Application Submitted!</Text>
              <Text style={[styles.feedbackText, { color: theme.text }]}>Your application for {job?.title} at {job?.companyName} has been submitted.</Text>
              <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackClose}>
                <Text style={styles.buttonText}>Okay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Apply for Job</Text>
              {job && (
                <View style={styles.jobInfoContainer}>
                  <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
                  <Text style={[styles.companyName, { color: theme.text }]}>{job.companyName}</Text>
                </View>
              )}
              <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Contact Number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />
              <TextInput style={[styles.input, styles.textArea]} placeholder="Why should we hire you?" value={reason} onChangeText={setReason} multiline />
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
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  jobInfoContainer: { marginBottom: 20, padding: 15, borderRadius: 8, borderWidth: 1 },
  jobTitle: { fontSize: 18, fontWeight: 'bold' },
  companyName: { fontSize: 16 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderRadius: 5, marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { marginTop: 10 },
  submitButton: { padding: 15, borderRadius: 5, alignItems: 'center', backgroundColor: '#28A745', marginBottom: 10 },
  cancelButton: { padding: 15, borderRadius: 5, alignItems: 'center', backgroundColor: '#FF3B30' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  feedbackContainer: { alignItems: 'center', padding: 20 },
  feedbackTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15 },
  feedbackText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

export default ApplyModal;
