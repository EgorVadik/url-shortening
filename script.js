const links = document.getElementById('links')

let storedLinks = localStorage.getItem('links')
if (storedLinks) {
    storedLinks = JSON.parse(storedLinks)

    storedLinks.forEach((link) => {
        const div = document.createElement('div')
        div.innerHTML = createDiv(link.originalUrl, link.shortUrl)
        links.appendChild(div)
    })
} else {
    links.classList.add('hidden')
}

// localStorage.clear()

async function shortenUrl() {
    const url = document.getElementById('url')
    const err1 = document.getElementById('err1')
    const err2 = document.getElementById('err2')

    if (url.value && isValidURL(url.value)) {
        err1.classList.add('hidden')
        err1.classList.remove(...['block', 'md:hidden'])

        err2.classList.remove('md:block')

        url.classList.remove(...['border-4', 'border-red'])

        const shortUrlObj = await getUrl(url.value)
        const shortUrl = shortUrlObj.result.full_short_link
        const div = document.createElement('div')
        div.innerHTML = createDiv(url.value, shortUrl)
        links.appendChild(div)

        let oldLinks = localStorage.getItem('links')
        if (oldLinks) {
            oldLinks = JSON.parse(oldLinks)
            oldLinks.push({
                originalUrl:
                    url.value.length > 30
                        ? url.value.slice(0, 30) + '...'
                        : url.value,
                shortUrl,
            })
            localStorage.setItem('links', JSON.stringify(oldLinks))
        } else {
            localStorage.setItem(
                'links',
                JSON.stringify([
                    {
                        originalUrl:
                            url.value.length > 30
                                ? url.value.slice(0, 30) + '...'
                                : url.value,
                        shortUrl,
                    },
                ])
            )
            links.classList.remove('hidden')
        }
    } else {
        err1.classList.remove('hidden')
        err1.classList.add(...['block', 'md:hidden'])

        err2.classList.remove('hidden')
        err2.classList.add(...['hidden', 'md:block'])

        url.classList.add(...['border-4', 'border-red'])
    }
}

async function getUrl(url) {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    return res.json()
}

function createDiv(originalUrl, shortUrl) {
    return `
        <div
            class="flex flex-wrap items-center p-4 bg-white my-4 rounded-lg"
        >
            <p class="mr-auto w-full md:w-fit">
                ${
                    originalUrl.length > 30
                        ? originalUrl.slice(0, 30) + '...'
                        : originalUrl
                }
            </p>

            <div class="h-px w-full bg-gray my-2 block md:hidden"></div>

            <a href="${shortUrl}" class="text-cyan mr-3 w-full md:w-fit">${shortUrl}</a>

            <button
                class="text-white bg-cyan hover:opacity-75 rounded-md px-5 p-1 w-full md:w-fit"
                onclick="navigator.clipboard.writeText('${shortUrl}')"
            >
                Copy
            </button>
    </div>
    `
}

function isValidURL(url) {
    const res = url.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    )
    return res !== null
}

const openMenu = document.getElementById('openMenu')

openMenu.addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('hidden')
})
