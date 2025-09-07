import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll().map(cookie => ({ name: cookie.name, value: cookie.value })),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );
};

// Helper function to get authenticated user on server side
export const getAuthenticatedUser = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
};

// Helper function for API route authentication
export const authenticateApiRequest = async () => {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return {
        user: null,
        response: new Response(
          JSON.stringify({ error: 'Unauthorized' }), 
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      };
    }
    
    return { user, response: null };
  } catch (error) {
    console.error('Error in authenticateApiRequest:', error);
    return {
      user: null,
      response: new Response(
        JSON.stringify({ error: 'Internal server error' }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    };
  }
};
