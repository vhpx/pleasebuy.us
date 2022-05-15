import Title from '../../components/common/Title.js';
import BankCardsTable from '../../components/dashboard/BankCardsTable.js';
import { SidebarLayout } from '../../components/layout/layout.js';
import { RequireAuth, useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Divider } from '@mui/material';
import { PlusIcon } from '@heroicons/react/outline';

ChartJS.register(ArcElement, Tooltip, Legend);

BankCardsDashboardPage.getLayout = (page) => {
    return <SidebarLayout>{page}</SidebarLayout>;
};

export default function BankCardsDashboardPage() {
    RequireAuth();

    const router = useRouter();

    const { userData } = useUser();
    const [initialized, setInitialized] = useState(false);

    const [cards, setCards] = useState(null);

    useEffect(() => {
        if (!userData) return;
        if (!userData?.isAdmin) {
            toast.error('You are not authorized to view this page.');
            router.replace('/');
        } else {
            setInitialized(true);
        }
    }, [userData, router]);

    const getDistinctCards = () => {
        return cards.reduce((acc, card) => {
            if (acc.includes(card.bank_code)) return acc;
            return [...acc, card.bank_code];
        }, []);
    };

    return initialized ? (
        <div className="p-4 md:p-8 lg:p-16">
            {cards && (
                <>
                    <Title label="Insights" className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <div className="max-w-sm">
                            <Pie
                                data={{
                                    labels: getDistinctCards(),
                                    datasets: [
                                        {
                                            label: 'Bank Cards',
                                            data: [
                                                // For each country, count the number of addresses
                                                ...getDistinctCards().map(
                                                    (bankCode) =>
                                                        cards.reduce(
                                                            (acc, card) =>
                                                                card.bank_code ==
                                                                bankCode
                                                                    ? acc + 1
                                                                    : acc,
                                                            0
                                                        )
                                                ),
                                            ],
                                            backgroundColor: [
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div className="my-8" />
                </>
            )}

            <div className="flex mb-4">
                <Title label="Bank Cards" />
                <button
                    className="p-2 bg-white hover:bg-blue-100 hover:text-blue-700 text-zinc-600 dark:text-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700/70 dark:hover:text-white rounded-lg transition duration-300 ml-2"
                    // onClick={showAdminCreationModal}
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>

            <BankCardsTable setter={setCards} />
        </div>
    ) : (
        <div></div>
    );
}
