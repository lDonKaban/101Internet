export const customSort = (a, b) => {
    if (a.hasOwnProperty('tv') && b.hasOwnProperty('tv')) {
        if (!a.tv?.hasOwnProperty('channels_hd')) {
            if (b.tv?.hasOwnProperty('channels_hd')) {
                return 1
            }
        }
        if (a.tv?.hasOwnProperty('channels_hd') && !b.tv?.hasOwnProperty('channels_hd')) {
            return -1
        }
    }

    if (a.hasOwnProperty('internet') && b.hasOwnProperty('internet')) {
        if (!a.internet?.hasOwnProperty('speed_in')) {
            return 1
        }
        if (a.internet?.hasOwnProperty('speed_in') && !b.internet?.hasOwnProperty('speed_in')) {
            return -1
        }
    }

    if (!a.hasOwnProperty('displayPrice') && b.hasOwnProperty('displayPrice')) {
        return 1
    }
    if (a.hasOwnProperty('displayPrice') && !b.hasOwnProperty('displayPrice')) {
        return -1
    }

    return 0
}
