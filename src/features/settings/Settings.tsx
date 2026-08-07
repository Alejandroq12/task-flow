import avatarUrl from '@/assets/avatar.png'
import { avatarSrc } from '@/lib/avatar'
import { useProfile } from '@/lib/profile'
import { QueryErrorAlert } from '@/components/ui/QueryErrorAlert'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

const titleCase = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())

function ProfileSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Loading your profile…
      </p>
      <div aria-hidden="true" className="flex max-w-2xl flex-col gap-6 rounded-lg bg-neutral-4 p-6">
        <div className="flex items-center gap-4">
          <div className="size-16 animate-pulse rounded-full bg-neutral-3" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 animate-pulse rounded bg-neutral-3" />
            <div className="h-4 w-64 animate-pulse rounded bg-neutral-3" />
          </div>
        </div>
        <div className="h-32 animate-pulse rounded bg-neutral-3" />
      </div>
    </>
  )
}

export function Settings() {
  const profile = useProfile()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-body-xl font-semibold text-neutral-1">Settings</h1>
      {profile.isPending && <ProfileSkeleton />}
      {profile.isError && (
        <QueryErrorAlert
          message="Something went wrong while loading your profile."
          onRetry={() => {
            void profile.refetch()
          }}
        />
      )}
      {profile.data !== undefined && (
        <section
          aria-label="Profile"
          className="flex max-w-2xl flex-col gap-6 rounded-lg bg-neutral-4 p-6"
        >
          <div className="flex items-center gap-4">
            <img
              className="size-16 rounded-full"
              src={avatarSrc(profile.data.profile.avatar) ?? avatarUrl}
              alt=""
            />
            <div className="min-w-0">
              <h2 className="truncate text-body-xl font-semibold text-neutral-1">
                {profile.data.profile.fullName}
              </h2>
              <p className="truncate text-body-m text-neutral-2">{profile.data.profile.email}</p>
            </div>
          </div>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-body-s text-neutral-2">Full name</dt>
              <dd className="text-body-m text-neutral-1">{profile.data.profile.fullName}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-body-s text-neutral-2">Email</dt>
              <dd className="text-body-m text-neutral-1">{profile.data.profile.email}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-body-s text-neutral-2">Type</dt>
              <dd>
                <span className="rounded bg-neutral-2/10 px-4 py-1 text-body-m font-semibold text-neutral-1">
                  {titleCase(profile.data.profile.type)}
                </span>
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-body-s text-neutral-2">Position</dt>
              <dd className="text-body-m text-neutral-2">Not provided by the API</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-body-s text-neutral-2">Created at</dt>
              <dd className="text-body-m text-neutral-1">
                {formatDate(profile.data.profile.createdAt)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-body-s text-neutral-2">Updated at</dt>
              <dd className="text-body-m text-neutral-1">
                {formatDate(profile.data.profile.updatedAt)}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  )
}
