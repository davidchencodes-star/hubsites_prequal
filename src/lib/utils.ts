import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { usePrequalStore, ZipCodeInfo } from "./store";
import { toast } from "react-toastify";
import { UseFormReturn } from "react-hook-form";
import { logit, logError } from "./logger";

// Helper to access setLoading from store
const setLoading = (loading: boolean) => usePrequalStore.getState().setLoading(loading);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSubmitData(data: any) {
  const fetchedData = usePrequalStore.getState().fetchedData;

  const payload = {
    id: fetchedData?.token,
    firstName: data.firstName,
    MI: data.MI,
    lastName: data.lastName,
    suffix: data.suffix,
    fullName: [data.firstName, data.MI, data.lastName].filter(Boolean).join(' '),
    address: data.address,
    zip: data.zip,
    city: data.city,
    state: data.state,
    homePhone: data.homePhone,
    mobilephone: data.mobilephone,
    email: data.email,
    chkiagree: data.chkiagree ? 1 : 0,
    dealerName: fetchedData?.name,
    dealerPhone: fetchedData?.phone,
    adfEmail: fetchedData?.adfEmail,
    adfEmails: Array.isArray(fetchedData?.adfEmails) 
      ? fetchedData?.adfEmails.join(',') 
      : fetchedData?.adfEmails,
    contactEmail: fetchedData?.contactEmail
  }

  logit(payload);
  return payload;
}

export async function getZipCode(
  zip: string,
  form: UseFormReturn<any>,
  onMultipleResults?: (items: ZipCodeInfo[], zip: string) => void
) {
  const config = usePrequalStore.getState().config;
  const payload = {
    id: config?.id,
    zip: zip
  }
  setLoading(true);
  try {
    const response = await fetch('/api/zipcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    if (result.success) {
      // populate the city/state or show decoded zipcode list
      if (result.content.items.length == 1) {
        const item = result.content.items[0];
        form.setValue('city', item.city);
        form.setValue('state', item.state);
      } else if (result.content.items.length > 1) {
        if (onMultipleResults) {
          onMultipleResults(result.content.items, zip);
        } else {
          toast.info(`Multiple cities found for zip ${zip}. Please select from the list.`);
          const item = result.content.items[0];
          form.setValue('city', item.city);
          form.setValue('state', item.state);
        }
      } else {
        // No matches found
        form.setValue('city', '');
        form.setValue('state', '');
        toast.warning(`No city found for zip code : ${zip}`);
      }
    } else {
      toast.error(result.msg || 'Failed to decode zipcode. Please try again.')
    }
  } catch (error) {
    logError('Error decoding zipcode:', error);
    toast.error('Failed to decode zipcode. Please try again.')
  } finally {
    setLoading(false);
  }
}


