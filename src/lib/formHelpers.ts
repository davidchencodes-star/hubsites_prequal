import { FieldErrors, FieldValues } from 'react-hook-form'

/**
 * Helper function to get error message for a field path
 * @param errors - Form errors object
 * @param fieldPath - The field path (e.g., 'firstName')
 * @returns Error message or undefined
 */
export function getFieldError(
  errors: FieldErrors<FieldValues>,
  fieldPath: string
): string | undefined {
  const pathParts = fieldPath.split('.')
  let current: any = errors
  
  for (const part of pathParts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return undefined
    }
  }
  
  return current?.message
}

/**
 * Helper function to check if a field has an error
 * @param errors - Form errors object
 * @param fieldPath - The field path
 * @returns Boolean indicating if field has error
 */
export function hasFieldError(
  errors: FieldErrors<FieldValues>,
  fieldPath: string
): boolean {
  return getFieldError(errors, fieldPath) !== undefined
}


