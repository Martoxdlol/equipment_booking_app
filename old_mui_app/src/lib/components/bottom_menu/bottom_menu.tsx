import styles from './bottom_menu.module.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { appStrings } from '../../../strings/app_strings';
import { useRouter } from 'next/router';

export default function BottomMenu({ }) {
    const router = useRouter()

    return <div className={styles.wrapper}>
        <div className={styles.menu}>
            <BottomNavigation
                showLabels
                value={'home'}
                onChange={(event, newValue) => {
                    router.push(newValue)
                }}
            >
                <BottomNavigationAction value={'/'} label={appStrings.home.text} icon={<HomeIcon />} />
                <BottomNavigationAction value={'/calendar'} label={appStrings.calendar.text} icon={<CalendarMonthIcon />} />
                <BottomNavigationAction value={'/request/new'} label={appStrings.new_request.text} icon={<AddIcon />} />
                <BottomNavigationAction value={'/equipment'} label={appStrings.assets.text} icon={<AccountTreeOutlinedIcon />} />
                {/* <BottomNavigationAction value={SETTINGS_PATH} showLabel={false} label={appStrings.get('settings')} icon={<SettingsIcon />} /> */}
            </BottomNavigation>
        </div>
    </div>

}

interface CircularButtonProps {
    children?: any
    onClick?: Function
    to?: string
}
