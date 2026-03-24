-- Create a test call with rich transcript for OpenAI analysis
-- Replace USER_ID with your actual user ID from the profiles table

INSERT INTO bland_ai_calls (
    id,
    user_id,
    lead_id,
    campaign_id,
    bland_call_id,
    phone_number,
    status,
    duration,
    transcript,
    summary,
    outcome,
    recording_url,
    call_data,
    started_at,
    completed_at,
    created_at,
    updated_at,
    ai_analysis,
    lead_score,
    qualification_status,
    analyzer_used
) VALUES (
    gen_random_uuid(),
    'YOUR_USER_ID_HERE', -- Replace with your actual user ID
    NULL,
    NULL,
    'test_call_' || extract(epoch from now()),
    '+1234567890',
    'completed',
    420, -- 7 minutes
    'user: Hello? assistant: Hi there! This is Sarah from TechSolutions. I''m calling because you showed interest in our business automation software. Do I have you at a good time? user: Oh yes, actually I was just thinking about this. We''ve been having issues with our current system. assistant: That''s great timing! Can you tell me a bit about what specific challenges you''re facing with your current setup? user: Well, our inventory management is really clunky and we''re spending too much time on manual data entry. It''s costing us hours every week. assistant: I completely understand. Time is money in business. How many hours would you estimate your team spends on this manual work weekly? user: Probably around 15-20 hours between me and my assistant. It''s really frustrating. assistant: That''s significant! At even $25 per hour, that''s $400-500 in labor costs weekly just for manual work. Our automation platform typically reduces that by 80-90%. Would saving 12-18 hours weekly be valuable for your business? user: Absolutely! That would be huge. What does something like that cost? assistant: Great question. Our solution typically pays for itself within 2-3 months through time savings alone. The investment ranges from $200-500 monthly depending on your business size. For a business like yours, I''d estimate around $299 monthly. How does that compare to the $1,600-2,000 you''re currently spending on manual labor monthly? user: Wow, when you put it like that, it''s a no-brainer. I''m definitely interested. What''s the next step? assistant: Excellent! I''d love to show you a personalized demo of exactly how this would work for your business. I can walk you through the inventory automation and data entry features. Do you have 30 minutes available either tomorrow afternoon or Thursday morning? user: Thursday morning works perfect. I''m the owner so I can make decisions quickly if I like what I see. assistant: Perfect! I have you down for Thursday at 10 AM. I''ll send you a calendar invite and demo link right after this call. One last question - besides inventory, are there other repetitive tasks your business handles that you''d like to automate? user: Actually yes, our customer follow-ups and invoice processing take forever too. assistant: Excellent! I''ll make sure to include those in your custom demo. You''ll see exactly how much time and money you can save across all these processes. I''m confident you''ll love what we can do for your business. user: This sounds amazing. I''m really looking forward to Thursday! assistant: Fantastic! You''ll receive that calendar invite within the next few minutes. Have a great rest of your day, and I''ll see you Thursday morning! user: Thank you so much. See you then! assistant: My pleasure. Goodbye! agent-action: Call completed successfully',
    'Highly qualified lead - business owner with clear pain points, strong budget fit, ready to move forward with demo',
    'demo_scheduled',
    'https://example.com/recording/test_call.mp3',
    '{"call_type": "sales", "lead_quality": "hot", "demo_scheduled": true}',
    now() - interval '7 minutes',
    now(),
    now(),
    now(),
    NULL, -- Will be filled by AI analysis
    NULL, -- Will be filled by AI analysis  
    NULL, -- Will be filled by AI analysis
    NULL  -- Will be filled by AI analysis
);

-- Show the created call
SELECT id, phone_number, status, transcript, created_at 
FROM bland_ai_calls 
WHERE phone_number = '+1234567890' 
ORDER BY created_at DESC 
LIMIT 1; 