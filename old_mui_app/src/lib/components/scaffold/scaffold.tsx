import styles from './scaffold.module.css'
export interface ScaffoldOptions {
    children: any
    top?: any
    bottom?: any
    topHeight?: string
    bottomHeight?: string
}

export default function Scaffold({ children, top, bottom, topHeight = '56px', bottomHeight = '56px' }: ScaffoldOptions) {
    return <div className={styles.route}>
        <div className={styles.top}>
            {top}
        </div>
        <div className={styles.body} style={{ marginBottom: bottom && bottomHeight, marginTop: top && topHeight }}>
            {children}
        </div>
        <div className={styles.bottom}>
            {bottom}
        </div>
    </div>
}