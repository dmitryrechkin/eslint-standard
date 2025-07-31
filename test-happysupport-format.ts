/**
 * Test file that reproduces the CommandValidationHelper.ts formatting issue
 */

export class TestValidationHelper {
    public static validateTicketPriority(priority: string | undefined): any {
        if (!priority) {
            return { success: true, data: undefined };
        }

        const priorityValue = priority.toUpperCase();

        // This switch statement should be formatted with Allman-style braces
        switch (priorityValue) {
            case 'LOW': {return { success: true, data: 'LOW' };}
            case 'MEDIUM': {return { success: true, data: 'MEDIUM' };}
            case 'HIGH': {return { success: true, data: 'HIGH' };}
            default: {
                return { success: false, error: 'Invalid priority' };
            }
        }
    }
}