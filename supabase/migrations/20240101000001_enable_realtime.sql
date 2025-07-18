-- Enable real-time subscriptions for Journal Flow tables

-- Enable real-time for journals table
ALTER PUBLICATION supabase_realtime ADD TABLE journals;

-- Enable real-time for profiles table  
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Enable real-time for sync_metadata table
ALTER PUBLICATION supabase_realtime ADD TABLE sync_metadata;