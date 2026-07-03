'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Utility to convert snake_case to camelCase
const toCamelCase = (str: string) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

// Utility to convert camelCase to snake_case
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const keysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = keysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const keysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnakeCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toSnakeCase(key)] = keysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

export function useSupabase<T>(tableName: string, orderByColumn: string = 'created_at', ascending: boolean = false) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order(orderByColumn, { ascending });

      if (fetchError) throw fetchError;
      
      const camelCaseResult = keysToCamelCase(result);
      setData(camelCaseResult as (T & { id: string })[]);
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [tableName, orderByColumn, ascending]);

  const add = async (document: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const snakeCaseDoc = keysToSnakeCase(document);
      const { data: newDoc, error: insertError } = await supabase
        .from(tableName)
        .insert([snakeCaseDoc])
        .select()
        .single();

      if (insertError) throw insertError;
      return newDoc.id;
    } catch (err) {
      console.error(`Error adding to ${tableName}:`, err);
      throw err;
    }
  };

  const update = async (id: string, document: Partial<T>) => {
    try {
      const snakeCaseDoc = keysToSnakeCase(document);
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ ...snakeCaseDoc, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error(`Error updating ${tableName}:`, err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      console.error(`Error deleting from ${tableName}:`, err);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove, refresh: fetchData };
}
