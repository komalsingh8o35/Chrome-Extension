

let seconds = 25 * 60;
let timerIsRunning = false;


chrome.alarms.onAlarm.addListener((alarm) => {
    seconds--;
    const minBaki = Math.floor(seconds / 60) + "M";
    chrome.action.setBadgeText(
        {
            text: minBaki,
        },
        () => { }
    );
    if (seconds <= 0) {
        clearAlarm('pomodoro-timer');
        createNotification("well Done! You focused well,Take a break");
        chrome.contextMenus.update("start-timer", {
            title: "StartTimer",
            contexts: ["all"],
        });
        chrome.action.setBadgeText(
            {
                text: "-"
            },
            () => { }
        );
        chrome.action.setBadgeBackgroundColor(
            { color: "green" },
            () => {
                /* ... */
            },
        );
    }
});

function createAlarm(name) {
    chrome.alarms.create(name, {
        periodInMinutes: 1 / 60,
    });
}

function createNotification(message) {
    const opt = {
        type: 'list',
        title: 'Pomodoro Timer',
        message,
        items: [{ title: 'pomodoro Timer', message: message }],
        iconUrl: 'icons/alarm-clock-48.png'
    };
    chrome.notifications.create(opt);
}
function clearAlarm(name) {
    chrome.alarms.clear(name, (wasCleared) => {
        console.log("wasCleared");
    });
}


chrome.contextMenus.create({
    id: "start-timer",
    title: "StartTimer",
    contexts: ["all"]
}, function () {
    if (chrome.runtime.lastError) {
        console.error("Error creating context menu: " + chrome.runtime.lastError.message);
    }
});

chrome.contextMenus.create({
    id: "reset-timer",
    title: "Reset Timer",
    contexts: ["all"]
}, function () {
    if (chrome.runtime.lastError) {
        console.error("Error creating context menu: " + chrome.runtime.lastError.message);
    }
});
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {
        case "reset-timer":
            chrome.contextMenus.update("start-timer", {
                title: "Start Timer",
                contexts: ["all"],
            });
                chrome.action.setBadgeText(
                    {
                        text: "R"
                    },
                    () => { }
                );
                clearAlarm("pomodoro-timer");
                chrome.action.setBadgeBackgroundColor(
                    { color: "" },
                    () => {
                        /* ... */
                    });
                createNotification("Your Timer has been reset");
                timerIsRunning = false;
                seconds = 0;
                break;
        case "start-timer":
            if (timerIsRunning) {
                chrome.action.setBadgeText(
                    {
                        text: "S"
                    },
                    () => { }
                );
                chrome.action.setBadgeBackgroundColor(
                    { color: "BLUE" },
                    () => {
                        /* ... */
                    },
                );
                createNotification("Your Timer has stoped");
                chrome.contextMenus.update("start-timer", {
                    title: "StartTimer",
                    contexts: ["all"],
                });
                timerIsRunning = false;
                return;
            }
            createNotification("Your Timer has started");
            timerIsRunning = true;
            createAlarm("pomodoro-timer");
            chrome.contextMenus.update("start-timer", {
                title: "stop Timer",
                contexts: ["all"],
            });
            break;

        default:
            break;
    }
});
chrome.action.setBadgeBackgroundColor(
    { color: "orange" },
    () => {
        /* ... */
    },
);