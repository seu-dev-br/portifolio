// src/pages/api/admin/messages.ts
import type { APIRoute } from 'astro';
import { apiService } from '../../../admin/services/api.service';

export const GET: APIRoute = async () => {
    try {
        const result = await apiService.getMessages();

        if (result.success) {
            return new Response(JSON.stringify({
                success: true,
                data: result.data
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            return new Response(JSON.stringify({
                success: false,
                error: result.error
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Erro no endpoint /api/admin/messages:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Erro interno do servidor'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
