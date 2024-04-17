'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModel from './MeetingModel'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from "@/components/ui/use-toast"
import Loader from './Loader'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input'

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const router = useRouter();
    const user = useUser();
    const client = useStreamVideoClient();
    const [values, setvalues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    })
    const [callDetails, setCallDetails] = useState<Call>()
    const {toast} = useToast();

    const createMeeting = async () => {
        if(!client || !user) return;

        try {
            if(!values.dateTime){
                toast({ title: "Please select Date and Time" });
                return;
            }
            

           const id = crypto.randomUUID();
           const call = client.call('default', id);
           
           if(!call) throw new Error('Failed to create meetingggg');
           const startAt= values.dateTime.toISOString();

           const description = values.description || 'Instant Meeting';

           await call.getOrCreate({
            data: {
                starts_at: startAt,
                custom:{
                    description,
                },
            },
           });
           setCallDetails(call);

           if(!values.description){
            console.log("Meeting ID ", call.id);            
            router.push("/meeting/"+call.id);
           }

           toast({ title: "Meeting started successfully" })
        } catch (error) {
            console.log('error');
            toast({ title: "Failed to create meeting" })
        }
    }

    if (!client || !user) return <Loader/>;

  const meetingLink = process.env.NEXT_PUBLIC_BASE_URL+"/meeting/"+callDetails?.id

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
        img='/icons/icons8-plus-50.png'
        title='New meeting'
        description='Start an instant meeting'
        handleClick = {() => {
            setMeetingState('isInstantMeeting')
        }}
        className = 'bg-orange-1'
        
        />
        <HomeCard 
        img='/icons/schedule.png'
        title='Schedule meeting'
        description='Plan your meeting'
        handleClick = {() => {
            setMeetingState('isScheduleMeeting')
        }}
        className = 'bg-blue-1'
        />
        <HomeCard 
        img='/icons/recordings.png'
        title='View Recordings'
        description='Checkout your recordings'
        handleClick = {() => {
            router.push('/recordings')
        }}
        className = 'bg-purple-1'
        />
        <HomeCard 
        img='/icons/videoconference.png'
        title='Join meeting'
        description='via invitation link'
        handleClick = {() => {
            setMeetingState('isJoiningMeeting')
        }}
        className = 'bg-yellow-1'
        />
        {!callDetails ? (
            <MeetingModel 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose = {() => {
                setMeetingState(undefined)
            }}
            title='Create Meeting'            
            handleClick ={createMeeting}
            >
                <div className='flex flex-col gap-2.5 '>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                    <Textarea className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
                    onChange={(e) => {
                        setvalues({...values, description: e.target.value})
                    }}
                    />
                </div>
                <div className='flex w-full flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
                <ReactDatePicker 
                selected= {values.dateTime}
                onChange={(date) => setvalues({...values, dateTime: date!})}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='time'
                dateFormat='MMMM d, yyyy h:mm aa'
                className='w-full rounded bg-dark-2 p-2 focus:outline-none'
                />
                </div>
            </MeetingModel>
        ) : (
            <MeetingModel 
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose = {() => {
                setMeetingState(undefined)
            }}
            title='Meeting Created'
            className ='text-center'            
            handleClick ={() => {
                navigator.clipboard.writeText(meetingLink);
                toast({title: 'link copied'})
            }}
            image='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'
            buttonText = 'copy meeting link'
            />
            
            )
        }
        <MeetingModel 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose = {() => {
            setMeetingState(undefined)
        }}
        title='Start an Instant Meeting'
        className ='text-center'
        buttonText ='Start Meeting'
        handleClick ={createMeeting}
        />

        <MeetingModel 
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose = {() => {
            setMeetingState(undefined)
        }}
        title='Type the link here'
        className ='text-center'
        buttonText ='Join Meeting'
        handleClick ={() => router.push(values.link)}
        >
            <Input 
            placeholder='Meeting link'
            className='border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e) => {setvalues({...values, link: e.target.value})}}
            />
        </MeetingModel>
    </section>
  )
}

export default MeetingTypeList