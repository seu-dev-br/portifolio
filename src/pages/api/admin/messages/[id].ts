// src/pages/api/admin/messages/[id].ts
import type { APIRoute } from 'astro';
import { apiService } from '../../../../admin/services/api.service';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
    try {
        const { id } = params;
        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID da mensagem é obrigatório'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const updateData = await request.json();

        // Se está marcando como lida
        if (updateData.status === 'read') {
            const result = await apiService.markMessageAsRead(id);

            if (result.success) {
                return new Response(JSON.stringify({
                    success: true
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
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        // Para outras atualizações, pode ser implementado futuramente
        return new Response(JSON.stringify({
            success: false,
            error: 'Operação não suportada'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Erro no endpoint PUT /api/admin/messages/[id]:', error);
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

export const DELETE: APIRoute = async ({ params }) => {
    try {
        const { id } = params;
        if (!id) {
            return new Response(JSON.stringify({
                success: false,
                error: 'ID da mensagem é obrigatório'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const result = await apiService.deleteMessage(id);

        if (result.success) {
            return new Response(JSON.stringify({
                success: true
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
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Erro no endpoint DELETE /api/admin/messages/[id]:', error);
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
