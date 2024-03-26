import { Box } from '@mui/material';
import AtomButton from 'atoms/Button/AtomButton';
import IconButton from 'atoms/Button/IconButton';
import { IconBack, IconColumns, IconList, IconNext } from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import Typography from 'atoms/Typography';
import { usePlatform, useTranslationWithContext } from 'hooks';
import { Moment } from 'moment';
import { renderDateTime } from 'util/time/formatTime';

export enum CalendarViewType {
    dayGridMonth = 'dayGridMonth',
    listWeek = 'listWeek',
    timeGridWeek = 'timeGridWeek',
    dayGridWeek = 'dayGridWeek',
    timeGridDay = 'timeGridDay',
}

interface Props {
    date: Moment;
    view: CalendarViewType;
    onChangeView: (view: CalendarViewType) => void;
    onPrevDate: VoidFunction;
    onNextDate: VoidFunction;
    onToday: VoidFunction;
    endSlot?: React.ReactNode;
    loading: boolean;
}

const CalendarToolbar: React.FC<Props> = ({
    date,
    view,
    onChangeView,
    onPrevDate,
    onNextDate,
    onToday,
    endSlot,
    loading,
}) => {
    const { translate } = useTranslationWithContext();
    const { isMobile } = usePlatform();

    const VIEW_OPTIONS = [
        {
            value: CalendarViewType.timeGridWeek,
            label: translate('generic.week'),
            icon: <IconColumns />,
        },
        {
            value: CalendarViewType.timeGridDay,
            label: translate('generic.day'),
            icon: <IconList />,
        },
    ];

    return (
        <Section spacingBottom="s">
            {isMobile ? (
                <>
                    <Box
                        sx={{ mb: 1 }}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <AtomButton
                            shadows={0}
                            border={1}
                            color="primary"
                            size="small"
                            variant="outlined"
                            onClick={onToday}
                        >
                            {translate('generic.today')}
                        </AtomButton>
                        {endSlot && endSlot}
                    </Box>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                            width: 'calc(100% + 12px)',
                        }}
                    >
                        <Box display="flex">
                            <Typography variant="h3">
                                {renderDateTime(date, 'ddd Do MMM')}
                            </Typography>
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="h3" fontWeight={400}>
                                    {renderDateTime(date, 'yyyy')}
                                </Typography>
                            </Box>
                        </Box>
                        <div>
                            <IconButton
                                icon={<IconBack />}
                                onClick={onPrevDate}
                                theme="dark"
                                size="l"
                                disabled={loading}
                            />

                            <IconButton
                                icon={<IconNext />}
                                onClick={onNextDate}
                                theme="dark"
                                size="l"
                                disabled={loading}
                            />
                        </div>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    <Box display="flex" alignItems="center">
                        <Box sx={{ mr: 1 }}>
                            <AtomButton
                                shadows={0}
                                border={1}
                                color="primary"
                                size="small"
                                variant="outlined"
                                onClick={onToday}
                            >
                                {translate('generic.today')}
                            </AtomButton>
                        </Box>
                        <div>
                            <IconButton
                                icon={<IconBack />}
                                onClick={onPrevDate}
                                theme="dark"
                                size="l"
                                disabled={loading}
                            />

                            <IconButton
                                icon={<IconNext />}
                                onClick={onNextDate}
                                theme="dark"
                                size="l"
                                disabled={loading}
                            />
                        </div>
                        <Box display="flex" sx={{ ml: 1, mr: 1 }}>
                            {view === CalendarViewType.timeGridWeek ? (
                                <Typography variant="h3">
                                    {renderDateTime(
                                        date.startOf('w'),
                                        'DD MMM'
                                    )}{' '}
                                    -{' '}
                                    {renderDateTime(date.endOf('w'), 'DD MMM')}
                                </Typography>
                            ) : (
                                <Typography variant="h3">
                                    {renderDateTime(date, 'dddd Do MMM')}
                                </Typography>
                            )}

                            <Box sx={{ ml: 1 }}>
                                <Typography variant="h3" fontWeight={400}>
                                    {renderDateTime(date, 'yyyy')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {endSlot && endSlot}
                </Box>
            )}

            {!isMobile && (
                <Box display="flex" alignItems="center">
                    {VIEW_OPTIONS.map((viewOption) => (
                        <Box sx={{ mr: 1 }} key={viewOption.value}>
                            <AtomButton
                                shadows={0}
                                border={1}
                                color={
                                    viewOption.value === view
                                        ? 'rose'
                                        : 'primary'
                                }
                                size="small"
                                variant={
                                    viewOption.value === view
                                        ? 'contained'
                                        : 'outlined'
                                }
                                startIcon={viewOption.icon}
                                onClick={() => onChangeView(viewOption.value)}
                            >
                                {viewOption.label}
                            </AtomButton>
                        </Box>
                    ))}
                    {loading && (
                        <Box sx={{ ml: 1 }}>
                            <Loader size={24} />
                        </Box>
                    )}
                </Box>
            )}
        </Section>
    );
};

export default CalendarToolbar;
