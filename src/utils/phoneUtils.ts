import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

// List of supported country codes
export const SUPPORTED_COUNTRIES = [
    'US', // +1
    'IN', // +91
    'PH', // +63
    'CA', // +1
    'GB', // +44
    'AU', // +61
    'NZ', // +64
    'SG', // +65
    'MY', // +60
    'AE', // +971
    'SA', // +966
    // Add more countries as needed
] as const;

export type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

export const formatPhoneNumber = (phoneNumber: string): string | null => {
    try {
        // Remove any non-numeric characters except + for initial country code
        const cleaned = phoneNumber.replace(/[^\d+]/g, '');

        // If it doesn't start with +, try to parse it
        const numberWithPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;

        // Try to parse the number
        const parsedNumber = parsePhoneNumber(numberWithPlus);
        if (!parsedNumber) {
            return null;
        }

        // Check if the country is supported
        if (!SUPPORTED_COUNTRIES.includes(parsedNumber.country as SupportedCountry)) {
            return null;
        }

        // Validate the number
        if (!parsedNumber.isValid()) {
            return null;
        }

        // Return the E.164 format (+CCXXXXXXXXX)
        return parsedNumber.format('E.164');
    } catch (error) {
        console.error('Error formatting phone number:', error);
        return null;
    }
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (!formattedNumber) {
            return false;
        }

        const parsedNumber = parsePhoneNumber(formattedNumber);
        return parsedNumber?.isValid() && SUPPORTED_COUNTRIES.includes(parsedNumber.country as SupportedCountry);
    } catch (error) {
        console.error('Error validating phone number:', error);
        return false;
    }
};

export const getCountryFromNumber = (phoneNumber: string): string | null => {
    try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (!formattedNumber) {
            return null;
        }

        const parsedNumber = parsePhoneNumber(formattedNumber);
        return parsedNumber?.country || null;
    } catch (error) {
        console.error('Error getting country from number:', error);
        return null;
    }
};

export const getCountryDisplayName = (countryCode: CountryCode): string => {
    const countryNames: Record<string, string> = {
        US: 'United States (+1)',
        IN: 'India (+91)',
        PH: 'Philippines (+63)',
        CA: 'Canada (+1)',
        GB: 'United Kingdom (+44)',
        AU: 'Australia (+61)',
        NZ: 'New Zealand (+64)',
        SG: 'Singapore (+65)',
        MY: 'Malaysia (+60)',
        AE: 'United Arab Emirates (+971)',
        // Add more countries as needed
    };

    return countryNames[countryCode] || countryCode;
}; 