import { getRooms } from '@/app/functions/settings/rooms/Rooms';
import { Room } from '@/app/types/Settings/Rooms';
import { ListRooms, RoomAdd, SearchRoom } from '@/components/Settings/Room';
import React from 'react'
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'จัดการห้อง | โรงเรียนภูเขียว',
  description: 'จัดการห้อง โรงเรียนภูเขียว',
}


export default async function ManageRoom({searchParams}:{
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;    
    const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : undefined;    
    const rooms : Room = await getRooms({search:search,page:page})
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">จัดการห้อง</h1>

            <RoomAdd />
            <SearchRoom />
            <ListRooms rooms={rooms} />
        </div>
    )
}