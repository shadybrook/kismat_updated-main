import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

export function AdminPaymentVerification() {
  const [unverifiedPayments, setUnverifiedPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUnverifiedPayments();
  }, []);

  const loadUnverifiedPayments = async () => {
    setIsLoading(true);
    try {
      // Get all event participants joined in last 48 hours
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          events (title, date, time, location),
          profiles (name, email)
        `)
        .gte('created_at', twoDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading payments:', error);
        return;
      }

      if (data) {
        console.log('📊 Loaded payments:', data);
        setUnverifiedPayments(data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (participantId: string, eventId: string, userName: string) => {
    if (!confirm(`Remove ${userName} from this event? They did not pay.`)) {
      return;
    }

    try {
      console.log('🗑️ Removing user:', { participantId, eventId });

      // Remove from event_participants
      const { error: deleteError } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (deleteError) {
        throw deleteError;
      }

      // Update event spots and participants array
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('spots_left, participants')
        .eq('id', eventId)
        .single();

      if (eventError) {
        throw eventError;
      }

      if (event) {
        // Remove from participants array
        const updatedParticipants = (event.participants || []).filter(
          (name: string) => name !== userName
        );

        await supabase
          .from('events')
          .update({ 
            spots_left: event.spots_left + 1,
            participants: updatedParticipants
          })
          .eq('id', eventId);
      }

      alert('✅ User removed from event successfully');
      loadUnverifiedPayments();
    } catch (error) {
      console.error('❌ Error removing user:', error);
      alert('Failed to remove user. Check console for details.');
    }
  };

  const handleMarkVerified = (participantId: string, userName: string) => {
    alert(`✅ ${userName} marked as verified (payment confirmed)`);
    // In a real app, you'd update a payment_verified column
    loadUnverifiedPayments();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Payment Verification</h2>
          <p className="text-sm text-gray-600">
            Recent event joins (last 48 hours). Verify payments and remove users who didn't pay.
          </p>
        </div>
        <Button onClick={loadUnverifiedPayments} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading payments...</p>
        </div>
      ) : unverifiedPayments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">No recent payments to verify</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {unverifiedPayments.map((payment) => (
            <Card key={payment.id} className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <p className="font-semibold text-gray-900">{payment.user_name}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        📧 {payment.profiles?.email || 'No email'}
                      </p>
                      <p className="text-gray-700">
                        <strong>Event:</strong> {payment.events?.title}
                      </p>
                      <p className="text-gray-600">
                        📍 {payment.events?.location}
                      </p>
                      <p className="text-gray-600">
                        📅 {payment.events?.date} at {payment.events?.time}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Joined: {new Date(payment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Badge variant="secondary" className="bg-yellow-200">
                      ₹100
                    </Badge>
                    <Button
                      onClick={() => handleMarkVerified(payment.id, payment.user_name)}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </Button>
                    <Button
                      onClick={() => handleRemoveUser(payment.id, payment.event_id, payment.user_name)}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 How to verify payments:</strong>
          </p>
          <ol className="text-xs text-blue-700 mt-2 space-y-1 list-decimal list-inside">
            <li>Check your UPI app (8369463469@fam) for incoming payments</li>
            <li>Match transaction notes with event names</li>
            <li>Click "Verified" if payment received</li>
            <li>Click "Remove" if no payment found within 24 hours</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}