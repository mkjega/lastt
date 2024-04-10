'use client';
import React, { useEffect, useState } from 'react'
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import { Button } from './ui/button';

const MeetingSetup = ({setIsSetupComplete}: {setIsSetupComplete:(value: boolean) => void}) => {
    const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false);
    const call = useCall();

    if(!call){
        new Error("not able to connect");
    }

    useEffect(() => {
        if(isMicCamToggledOn){
            call?.camera.disable();
            call?.microphone.disable();
        } else{
            call?.camera.enable();
            call?.microphone.enable();
        }

    }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return(
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
        <h1 className="text-2xl font-bold">
            Setup
        </h1>
        <VideoPreview />
        <div className='flex h-16 items-center justify-center gap-3'>
            <label className='fex items-center justify-center gap-2 font-medium'>
                <input
                 type='checkbox'
                 checked = {isMicCamToggledOn}
                 onChange={(e) => setisMicCamToggledOn(e.target.checked)}
                >
                </input>
                Join with mic and camera 
            </label>
            <DeviceSettings />
        </div>
        <Button className='rounded-md bg-green-500 px-4 py-2.5'
        onClick={() => {
            call?.join();

            setIsSetupComplete(true);
        }}
        >
            Join Meeting
        </Button>
    </div>
  )
}

export default MeetingSetup