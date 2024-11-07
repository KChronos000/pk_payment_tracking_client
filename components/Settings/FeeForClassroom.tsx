'use client'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'react-toastify'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import TablePagination from './TablePagination'
import { Res } from '@/app/types/Settings/Response'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FeeForClassroom, FeeForClassroomData } from '@/app/types/Settings/Classrooms'
import { SubmitAddFeeForClassroom, SubmitEditFeeForClassroom, SubmitRemoveFeeForClassroom } from '@/app/action/settings/Classrooms'
import { Label } from '../ui/label'

interface FeeForClassroomEditProps {
    feeOptions: {
        fees: {
            id: number,
            amount:number,
            name: string,
        }[]
    };
    classroomOptions: {
        id: number,
        education_year: {
            id: number,
            name: string,
        },
        education_term: {
            id: number,
            name: string,
        },
        level: {
            id: number,
            name: string,
        },
        room: {
            id: number,
            name: string,
        },
    }[];
    editingFeeForClassroom: FeeForClassroomData | null;
    setEditingFeeForClassroom: (classroom: FeeForClassroomData | null) => void;
    handleUpdateFeeForClassroom: () => void;
}

export const ButtonSubmitFormAddFeeForClassroom = () => {
    const { pending } = useFormStatus()
    return (
        <Button disabled={pending} type='submit'>{pending ? "กำลังโหลด..." : "เพิ่มค่าธรรมสำหรับห้องเรียน"}</Button>
    )
}

export const SearchFeeForClassroom = () => {
    const router = useRouter();
    const [text, setText] = useState('');
    useEffect(() => {
        if (!text || text.trim() === '') {
            router.push(`/admin/fee/classrooms`);
        } else {
            const debounceTimer = setTimeout(() => {
                router.push(`/admin/fee/classrooms?search=${text}`);
            }, 300);
            return () => clearTimeout(debounceTimer);
        }
    }, [text, router]);

    return (
        <div className="mb-4">
            <Input
                type="text"
                placeholder="ค้นหาค่าธรรมเนียมในห้องเรียน..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full"
            />
        </div>
    );
};

interface FeeForClassroomAddProps {
    feeOptions: {
        fees: {
            id: number,
            amount:number,
            name: string,
        }[]
    },
    classroomOptions: {
        id: number,
        education_year: {
            id: number,
            name: string,
        },
        education_term: {
            id: number,
            name: string,
        },
        level: {
            id: number,
            name: string,
        },
        room: {
            id: number,
            name: string,
        },
    }[];
}

export const FeeForClassroomAdd: FC<FeeForClassroomAddProps> = ({ feeOptions, classroomOptions }) => {
    const ref = useRef<HTMLFormElement>(null);
    const handleSubmit = async (formData: FormData) => {
        try {
            const res: Res = await SubmitAddFeeForClassroom(formData);
            toast[res.type](res.message);
            if (res.type !== 'error') {
                ref.current?.reset();
                setSelectedValues({
                    fee: '',
                    classroom: '',
                });
            }
        } catch (error) {
            console.error('Failed to add feeForClassroom:', error);
            toast.error('ไม่สามารถเพื่มค่าธรรมเนียมในห้องเรียนได้ กรุณาลองอีกครั้ง');
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setSelectedValues((prev) => ({ ...prev, [name]: value }));
    };
    
    const [selectedValues, setSelectedValues] = useState({
        fee: '',
        classroom: '',
    });

    return (
        <form ref={ref} action={async (formData: FormData) => {
            await handleSubmit(formData)
        }} method="post">
            <div className="flex space-x-2">
                <div className='w-full'>
                    <Select name='fee'
                    value={selectedValues.fee}
                    onValueChange={(value) => handleSelectChange('fee', value)}
                    >
                        <SelectTrigger id="fee">
                            <SelectValue placeholder="เลือกค่าธรรมเนียม" />
                        </SelectTrigger>
                        <SelectContent>
                            {feeOptions.fees.map((fee) => (
                                <SelectItem key={fee.id} value={fee.id.toString()}>
                                    {fee.name} จำนวน {fee.amount.toString()} บาท
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full">
                    <Select name='classroom'
                    value={selectedValues.classroom}
                    onValueChange={(value) => handleSelectChange('classroom', value)}>
                        <SelectTrigger id="classroom">
                            <SelectValue placeholder="เลือกห้องเรียน" />
                        </SelectTrigger>
                        <SelectContent>
                            {classroomOptions.map((classroom) => (
                                <SelectItem key={classroom.id} value={classroom.id.toString()}>
                                    {classroom.level.name}/{classroom.room.name} ปีการศึกษา {classroom.education_year.name} ภาคเรียนที่ {classroom.education_term.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <ButtonSubmitFormAddFeeForClassroom />
            </div>
        </form>
    )
}

export const ListFeeForClassrooms = ({ feeForClassrooms, feeOptions, classroomOptions }: {
    feeForClassrooms: FeeForClassroom,
    feeOptions: { fees: { id: number, amount: number, name: string }[] }, classroomOptions: {
        id: number,
        education_year: {
            id: number,
            name: string,
        },
        education_term: {
            id: number,
            name: string,
        },
        level: {
            id: number,
            name: string,
        },
        room: {
            id: number,
            name: string,
        },
    }[]
}) => {
    const [editingFeeForClassroom, setEditingFeeForClassroom] = useState<FeeForClassroomData | null>(null);
    const handleEditFeeForClassroom = (feeForClassroom: FeeForClassroomData) => {
        setEditingFeeForClassroom(feeForClassroom);
    };

    const handleUpdateFeeForClassroom = async () => {
        try {
            if (!editingFeeForClassroom) {
                return toast.error('ไม่สามารถแก้ไขค่าธรรมเนียมในห้องเรียนได้ กรุณาลองอีกครั้ง');
            }
            const res: Res = await SubmitEditFeeForClassroom(editingFeeForClassroom);
            toast[res.type](res.message);
            setEditingFeeForClassroom(null);
        } catch (error) {
            console.error('Failed to edit fee for classroom:', error);
            toast.error('ไม่สามารถแก้ไขค่าธรรมเนียมในห้องเรียนได้ กรุณาลองอีกครั้ง');
        }
    };

    const handleRemoveFeeForClassroom = async (id: number) => {
        try {
            if (!id) {
                return toast.error('ไม่สามารถลบค่าธรรมเนียมในห้องเรียนได้ กรุณาลองอีกครั้ง');
            }
            const res: Res = await SubmitRemoveFeeForClassroom(id);
            toast[res.type](res.message);
        } catch (error) {
            console.error('Failed to remove room:', error);
            toast.error('ไม่สามารถลบค่าธรรมเนียมในห้องเรียนได้ กรุณาลองอีกครั้ง');
        }
    };

    return (
        <>
            <TablePagination pagination={feeForClassrooms.pagination} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ค่าธรรมเนียม</TableHead>
                        <TableHead>จำนวน</TableHead>
                        <TableHead>ปีการศึกษา</TableHead>
                        <TableHead>ภาคเรียน</TableHead>
                        <TableHead>ระดับชั้น</TableHead>
                        <TableHead>ห้อง</TableHead>
                        <TableHead>สร้างเมื่อ</TableHead>
                        <TableHead>อัพเดทเมื่อ</TableHead>
                        <TableHead>จัดการ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {feeForClassrooms.data && feeForClassrooms.data.length > 0 ? (
                        feeForClassrooms.data.map((feeForClassroom) => (
                            <TableRow key={feeForClassroom.id}>
                                <TableCell>{feeForClassroom.fee.name}</TableCell>
                                <TableCell>{feeForClassroom.fee.amount}</TableCell>
                                <TableCell>{feeForClassroom.classroom.education_year.name}</TableCell>
                                <TableCell>{feeForClassroom.classroom.education_term.name}</TableCell>
                                <TableCell>{feeForClassroom.classroom.level.name}</TableCell>
                                <TableCell>{feeForClassroom.classroom.room.name}</TableCell>
                                <TableCell>{new Date(feeForClassroom.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(feeForClassroom.updatedAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button variant="outline" className="mr-2" onClick={() => handleEditFeeForClassroom(feeForClassroom)}>แก้ไข</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">ลบ</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>กรุณายืนยัน</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    การลบนี้ไม่สามารถกู้คืนได้
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleRemoveFeeForClassroom(Number(feeForClassroom.id))}>ลบ</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell className='text-center' colSpan={9}>ไม่พบค่าธรรมเนียมในห้อง</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <FeeForClassroomEdit feeOptions={feeOptions} classroomOptions={classroomOptions} editingFeeForClassroom={editingFeeForClassroom} setEditingFeeForClassroom={setEditingFeeForClassroom} handleUpdateFeeForClassroom={handleUpdateFeeForClassroom} />
        </>
    )
}

export const FeeForClassroomEdit: FC<FeeForClassroomEditProps> = ({ feeOptions, classroomOptions, editingFeeForClassroom, setEditingFeeForClassroom, handleUpdateFeeForClassroom }) => {
    if (!editingFeeForClassroom) return null;

    return (
        <AlertDialog open={!!editingFeeForClassroom} onOpenChange={() => setEditingFeeForClassroom(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>แก้ไขค่าธรรมเนียมในห้อง</AlertDialogTitle>
                </AlertDialogHeader>
                <Label>ค่าธรรมเนียม</Label>
                <div className="w-full">
                    <Select
                        defaultValue={
                            feeOptions.fees.find((fee) => editingFeeForClassroom.fee.id === fee.id)?.id.toString() || ''
                        }
                        onValueChange={(value) =>
                            setEditingFeeForClassroom({
                                ...editingFeeForClassroom,
                                fee: {
                                    ...editingFeeForClassroom.fee,
                                    id: Number(value),
                                }
                            })
                        }
                        name="fee"
                    >
                        <SelectTrigger id="fee">
                            <SelectValue placeholder="เลือกค่าธรรมเนียม" />
                        </SelectTrigger>
                        <SelectContent>
                            {feeOptions.fees.map((fee) => (
                                <SelectItem key={fee.id} value={fee.id.toString()}>
                                    {fee.name} จำนวน {fee.amount.toString()} บาท
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Label>ห้องเรียน</Label>
                <div className="w-full">
                    <Select
                        defaultValue={
                            classroomOptions.find((classroom) => editingFeeForClassroom.classroom.id === classroom.id)?.id.toString() || ''
                        }
                        onValueChange={(value) =>
                            setEditingFeeForClassroom({
                                ...editingFeeForClassroom,
                                classroom: {
                                    ...editingFeeForClassroom.classroom,
                                    id: Number(value),
                                }
                            })
                        }
                        name="classroom"
                    >
                        <SelectTrigger id="classroom">
                            <SelectValue placeholder="เลือกห้องเรียน" />
                        </SelectTrigger>
                        <SelectContent>
                            {classroomOptions.map((classroom) => (
                                <SelectItem key={classroom.id} value={classroom.id.toString()}>
                                    {classroom.level.name}/{classroom.room.name} ปีการศึกษา {classroom.education_year.name} ภาคเรียนที่ {classroom.education_term.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setEditingFeeForClassroom(null)}>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUpdateFeeForClassroom}>แก้ไข</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};