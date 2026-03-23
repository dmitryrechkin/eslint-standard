
export class TicketsResumableGeneratorService {
    private async processTicketsBatch(): Promise<void> {
        try {
            for (const ticket of tickets) {
                if (shouldProcess) {
                    for (const conversation of ticket.conversations) {
                        if (conversation.body_text) {
                            // This is 4 levels deep
                            console.log('Processing');
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
