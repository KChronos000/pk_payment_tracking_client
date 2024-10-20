'use client'
import React, { FC, useState } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Student } from '@/app/types/Students';
import { useUser } from '@/app/contexts/User';

const getPaymentStatusBadge = (payStatus: string) => {
    switch (payStatus) {
        case 'done':
            return <Badge variant="default">ชำระครบเรียบร้อย</Badge>;
        case 'paying':
            return <Badge variant="secondary">อยู่ระหว่างชำระ</Badge>;
        default:
            return <Badge variant="destructive">ยังไม่ชำระ</Badge>;
    }
};
interface StudentCardProps {
    student: Student
}

const StudentCard: FC<StudentCardProps> = ({ student }) => {
    const [isReceiptsOpen, setIsReceiptsOpen] = useState<boolean>(false);
    const user = useUser();
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <User className="w-12 h-12 text-gray-400 mr-4" />
                    <div>
                        <p className="font-semibold text-md">{student.student.name}</p>
                        <p className="text-sm text-gray-500">รหัสนักเรียน: {student.student_sid.toString()}</p>
                    </div>
                </div>

                {(user?.data.role?.id === 2 || user?.data.role?.id === 3) && (
                    <div>
                        <div className="flex justify-between items-center mt-2">
                            {getPaymentStatusBadge(student.pay_status)}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs p-1"
                                onClick={() => setIsReceiptsOpen(!isReceiptsOpen)}
                            >
                                {isReceiptsOpen ? 'ซ่อน' : 'แสดง'}เล่มใบเสร็จ
                                {isReceiptsOpen ? (
                                    <ChevronUp className="ml-1 h-3 w-3" />
                                ) : (
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                )}
                            </Button>
                        </div>

                        {isReceiptsOpen && (
                            student.studentReceipts.length > 0 ? (
                                <div className="mt-3 space-y-2 text-sm">
                                    {student.studentReceipts.map((receipt, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-100 dark:bg-gray-700 p-2 rounded"
                                        >
                                            <p className="font-medium">
                                                {receipt.receiptBook.name}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {receipt.amount} บาท
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-sm mt-3">
                                    นักเรียนไม่มีเล่มใบเสร็จ
                                </div>
                            )
                        )}
                    </div>
                )}

            </CardContent>
        </Card>
    );
};

export default StudentCard;