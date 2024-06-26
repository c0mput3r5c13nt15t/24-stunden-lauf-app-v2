import { useState } from 'react';
import Loading from '@/components/Loading';
import Head from '@/components/Head';
import useRemoteConfig from '@/lib/firebase/useRemoteConfig';
import { RunnerWithLapCount } from '@/lib/interfaces';
import SearchBar from '@/components/SearchBar';
import ListItem from '@/components/ListItem';
import { getRunnersWithLapCount } from '@/lib/utils/firebase/backend';
import Icon from '@/components/Icon';
import {
  defaultClasses,
  defaultDistancePerLap,
  defaultHouses,
} from '@/lib/firebase/remoteConfigDefaultValues';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import { filterRunner, formatKilometer } from '@/lib/utils';

// Incremental static regeneration to reduce load on backend
export async function getStaticProps() {
  return {
    props: {
      runnersWithLapCount: JSON.parse(
        JSON.stringify(await getRunnersWithLapCount())
      ),
      lastUpdated: Date.now(),
    },
    revalidate: 60 * 3, // Revalidate at most every 3 minutes
  };
}

function RankingPage({
  runnersWithLapCount,
  lastUpdated,
}: {
  runnersWithLapCount: RunnerWithLapCount[];
  lastUpdated: number;
}) {
  const user = useUser();

  const [distancePerLap] = useRemoteConfig(
    'distancePerLap',
    defaultDistancePerLap
  );
  const [classes] = useRemoteConfig('classes', defaultClasses);
  const [houses] = useRemoteConfig('houses', defaultHouses);

  console.log(defaultHouses);
  console.log(houses);

  // Variables for filtering
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterClasses, setFilterClasses] = useState('');
  const [filterHouse, setFilterHouse] = useState('');

  function getPosition(runner: RunnerWithLapCount): number {
    // Get position of runner in runnersWithLapCount array
    return runnersWithLapCount
      .sort((a, b) => b.lapCount - a.lapCount)
      .findIndex(
        (runnerWithLapCount) => runnerWithLapCount.lapCount == runner.lapCount
      );
  }

  return (
    <>
      <Head title="Läufer" />
      <main className="flex !h-auto !min-h-[100dvh] min-h-[100vh] w-full flex-col items-center justify-start bg-base-200">
        <SearchBar
          backLink={
            user?.id === process.env.NEXT_PUBLIC_ASSISTANT_ACCOUNT_UID
              ? '/assistant'
              : '/runner'
          }
          searchValue={filterName}
          setSearchValue={setFilterName}
          filters={[
            {
              filerValue: filterType,
              setFilterValue: setFilterType,
              filterOptions: [
                { value: '', label: 'Alle Typen' },
                { value: 'student', label: 'Schüler' },
                { value: 'staff', label: 'Mitarbeiter' },
                { value: 'other', label: 'Gäste' },
              ],
            },
            {
              filerValue: filterClasses,
              setFilterValue: setFilterClasses,
              filterOptions: [
                { value: '', label: 'Alle Klassen' },
                ...classes.map((_class) => ({
                  value: _class,
                  label: _class,
                })),
              ],
            },
            {
              filerValue: filterHouse,
              setFilterValue: setFilterHouse,
              filterOptions: [
                { value: '', label: 'Alle Häuser' },
                ...houses.map((house) => ({ value: house.abbreviation, label: house.name })),
              ],
            },
          ]}
        />

        <div className="vertical-list">
          {/* Last updated */}
          <div className="flex w-full justify-center gap-1 text-center text-sm">
            <Icon name="InformationCircleIcon" />
            Stand{' '}
            {new Date(lastUpdated).toLocaleDateString('de-DE', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              timeZone: 'Europe/Berlin',
            })}{' '}
            {new Date(lastUpdated).toLocaleString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Berlin',
            })}
            Uhr
          </div>
          {runnersWithLapCount
            .filter((runnerWithLapCount) => {
              return filterRunner(runnerWithLapCount, {
                filterType,
                filterName,
                filterClasses,
                filterHouse,
              });
            })
            .sort((a, b) => b.lapCount - a.lapCount)
            .map((runnerWithLapCount) => {
              return (
                <ListItem
                  highlight={runnerWithLapCount.email === user?.email}
                  key={runnerWithLapCount.number}
                  number={getPosition(runnerWithLapCount) + 1}
                  mainContent={
                    (['🥇', '🥈', '🥉'][getPosition(runnerWithLapCount)] ||
                      '') + runnerWithLapCount.name
                  }
                >
                  <div className="flex w-1/4 flex-row items-center justify-between pr-1">
                    <div className="pr-2">
                      <div className="stat-value text-center text-lg font-semibold md:text-xl">
                        {runnerWithLapCount.number}
                      </div>
                      <div className="stat-title -mt-2 text-center text-xs">
                        Nr.
                      </div>
                    </div>
                    <div className="pr-2">
                      <div className="stat-value text-center text-lg font-semibold md:text-xl">
                        {runnerWithLapCount.lapCount.toString()}
                      </div>
                      <div className="stat-title -mt-2 text-center text-xs">
                        Runden
                      </div>
                    </div>
                    <div className="pr-2">
                      <div className="stat-value text-center text-lg font-semibold md:text-xl">
                        {runnerWithLapCount.lapCount &&
                          formatKilometer(
                            runnerWithLapCount.lapCount * distancePerLap
                          )}
                      </div>
                      <div className="stat-title -mt-2 text-center text-xs">
                        km
                      </div>
                    </div>
                  </div>
                </ListItem>
              );
            })}
          <div className="w-full text-center text-sm">
            Keine weiteren Läufer
          </div>
        </div>
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
  // @ts-ignore
})(RankingPage);
