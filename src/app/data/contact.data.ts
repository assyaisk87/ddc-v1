export interface ContactInfo {
  emailKey: string;
  phoneKey: string;
  addressKey: string;
  hoursKey: string;
}

export const CONTACT_INFO: ContactInfo = {
  emailKey: 'contacts.info.email.text',
  phoneKey: 'contacts.info.phone.text',
  addressKey: 'contacts.info.address.text',
  hoursKey: 'contacts.info.hours.text'
};