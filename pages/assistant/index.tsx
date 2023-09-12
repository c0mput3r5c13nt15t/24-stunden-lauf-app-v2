import { useEffect, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import Icon from '@/components/Icon';
import { Lap, Runner } from '@/lib/interfaces';
import { themedPromiseToast } from '@/lib/utils/frontend';
import { createLap, deleteLap } from '@/lib/utils/firebase/frontend';
import ListItem from '@/components/ListItem';
import useCollectionAsDict from '@/lib/hooks/useCollectionAsDict';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';

function AssistantIndexPage() {
  const user = useUser();
  const [createdLaps, setCreatedLaps] = useState<Lap[]>([]);
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    'apps/24-stunden-lauf/runners'
  );

  const [number, setNumber] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function createNewLapHandler() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    await createLap(number, runners, await user.getIdToken())
      .then((newLap) => {
        setNumber(0);

        setCreatedLaps([newLap, ...(createdLaps || [])]);
      })
      .finally(() => {
        setSubmitting(false);

        // Focus input
        (document.getElementById('number') as HTMLInputElement).focus();
      });
  }

  async function deleteLapHandler(lapId: string) {
    themedPromiseToast(deleteLap(lapId), {
      pending: 'Runde wird gelöscht',
      success: 'Runde erfolgreich gelöscht',
      error: {
        render: ({ data }: any) => {
          if (data.message) {
            return data.message;
          } else if (typeof data === 'string') {
            return data;
          }
          return 'Fehler beim Löschen der Runde';
        },
      },
    }).then(() => {
      // Filer out deleted lap
      setCreatedLaps(createdLaps?.filter((lap) => lap.id !== lapId) || null);
    });
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="main !py-0">
        <div className="w-full grid !h-screen grid-cols-2 justify-around landscape:pl-10">
          <section className="flex flex-col items-center justify-center gap-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-2">
                <input
                  id="number"
                  name="number"
                  className={`font-serif input-bordered input rounded-box box-border h-full w-full max-w-[18rem] text-center text-5xl font-medium tracking-widest sm:text-9xl ${
                    Object.values(runners).find(
                      (runner) => runner.number == number
                    ) != undefined
                      ? 'input-success'
                      : 'input-error'
                  }`}
                  autoFocus
                  onChange={(e) => {
                    e.preventDefault();
                    if (submitting) {
                      return;
                    }
                    if (!isNaN(+e.target.value)) {
                      setNumber(+e.target.value);
                    }
                  }}
                  onKeyDown={async (e) => {
                    if (submitting) {
                      return;
                    }
                    if (e.key === 'Enter') {
                      themedPromiseToast(createNewLapHandler, {
                        pending: 'Runde wird hinzugefügt',
                        success: 'Runde erfolgreich hinzugefügt',
                        error: {
                          render: ({ data }: any) => {
                            if (data.message) {
                              return data.message;
                            } else if (typeof data === 'string') {
                              return data;
                            }
                            return 'Fehler beim Hinzufügen der Runde';
                          },
                        },
                      });
                    }
                  }}
                  type="text"
                  value={Number(number).toString()}
                  min={0}
                  required
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="w-full text-center text-sm">
              Drücke <kbd className="kbd kbd-sm">Enter</kbd>, um eine Runde zu
              zählen
            </div>
          </section>
          <section className="vertical-list !flex">
            {createdLaps.length > 0 ? (
              <>
                {createdLaps
                  .sort((a, b) => {
                    return (
                      // @ts-ignore
                      b.createdAt - a.createdAt
                    );
                  })
                  .map((lap) => (
                    <ListItem
                      key={lap.id}
                      number={runners[lap.runnerId]?.number}
                      mainContent={runners[lap.runnerId]?.name || 'Unbekannt'}
                    >
                      <button
                        className="btn-outline btn-error btn-square btn-sm btn hidden text-error md:flex"
                        aria-label="Runde löschen"
                        onClick={async () => await deleteLapHandler(lap.id)}
                      >
                        <Icon name="TrashIcon" />
                      </button>
                    </ListItem>
                  ))}
                <div className="w-full text-center text-sm">
                  Zuletzt erstellte Runden
                </div>
              </>
            ) : (
              <div className="w-full text-center text-sm">
                Du hast noch keine Runden erstellt
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
})(AssistantIndexPage);
