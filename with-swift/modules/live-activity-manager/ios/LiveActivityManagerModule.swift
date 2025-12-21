import ActivityKit
import SwiftUI
import ExpoModulesCore

// MARK: - Errors

final class FeatureUnavailableError: GenericException<Void> {
    override var reason: String {
        return "This device does not support Live Activities."
    }
}

// MARK: - Activity Attributes

struct WidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic state
        var homeScore: Int
        var awayScore: Int
        var currentQuarter: Int
        var timeRemaining: String
    }

    // Static state
    var homeTeam: String
    var awayTeam: String
}

// MARK: - Return Models

struct StartResult: Record {
    @Field var activityId: String?
    @Field var success: Bool
    @Field var errorMessage: String?
}

struct StopResult: Record {
    @Field var activityId: String?
    @Field var success: Bool
    @Field var errorMessage: String?
}

struct UpdateResult: Record {
    @Field var success: Bool
}

struct TokenResult: Record {
    @Field var token: String?
    @Field var success: Bool
    @Field var errorMessage: String?
}

// MARK: - Expo Module

public class LiveActivityManagerModule: Module {

    public func definition() -> ModuleDefinition {
        Name("LiveActivityManager")

        // MARK: Start Activity

        AsyncFunction("beginActivity") { (
            homeTeam: String,
            awayTeam: String,
            homeScore: Int,
            awayScore: Int,
            currentQuarter: Int,
            timeRemaining: String,
            promise: Promise
        ) in

            guard #available(iOS 16.2, *) else {
                throw FeatureUnavailableError(())
            }

            guard ActivityAuthorizationInfo().areActivitiesEnabled else {
                throw FeatureUnavailableError(())
            }

            let attributes = WidgetAttributes(homeTeam: homeTeam, awayTeam: awayTeam)
            let contentState = WidgetAttributes.ContentState(
                homeScore: homeScore,
                awayScore: awayScore,
                currentQuarter: currentQuarter,
                timeRemaining: timeRemaining
            )

            let content = ActivityContent(state: contentState, staleDate: nil)

            do {
                let activity = try Activity.request(
                    attributes: attributes,
                    content: content
                )

                promise.resolve(
                    StartResult(
                        activityId: Field(wrappedValue: activity.id),
                        success: Field(wrappedValue: true)
                    )
                )

            } catch {
                promise.resolve(
                    StartResult(
                        success: Field(wrappedValue: false),
                        errorMessage: Field(
                            wrappedValue: "Unable to start Live Activity: \(error.localizedDescription)"
                        )
                    )
                )
            }
        }

        // MARK: Stop Activity

        AsyncFunction("endActivity") { (activityId: String, promise: Promise) in

            guard #available(iOS 16.2, *) else {
                throw FeatureUnavailableError(())
            }

            Task {
                guard let activity = Activity<WidgetAttributes>.activities.first(
                    where: { $0.id == activityId }
                ) else {
                    return promise.resolve(
                        StopResult(
                            success: Field(wrappedValue: false),
                            errorMessage: Field(wrappedValue: "Activity not found")
                        )
                    )
                }

                await activity.end(dismissalPolicy: .immediate)

                promise.resolve(
                    StopResult(
                        activityId: Field(wrappedValue: activityId),
                        success: Field(wrappedValue: true)
                    )
                )
            }
        }

        // MARK: Update Activity

        AsyncFunction("updateActivity") { (
            activityId: String,
            homeScore: Int,
            awayScore: Int,
            currentQuarter: Int,
            timeRemaining: String,
            promise: Promise
        ) in

            guard #available(iOS 16.2, *) else {
                throw FeatureUnavailableError(())
            }

            let updatedState = WidgetAttributes.ContentState(
                homeScore: homeScore,
                awayScore: awayScore,
                currentQuarter: currentQuarter,
                timeRemaining: timeRemaining
            )

            let updatedContent = ActivityContent(
                state: updatedState,
                staleDate: nil
            )

            Task {
                let activity = Activity<WidgetAttributes>.activities.first {
                    $0.id == activityId
                }

                guard let active = activity else {
                    return promise.resolve(UpdateResult(success: Field(wrappedValue: false)))
                }

                do {
                    try await active.update(updatedContent)
                    promise.resolve(UpdateResult(success: Field(wrappedValue: true)))
                } catch {
                    promise.resolve(UpdateResult(success: Field(wrappedValue: false)))
                }
            }
        }

        // MARK: Push-to-Start Token

        AsyncFunction("fetchPushToken") { (promise: Promise) in
            guard #available(iOS 17.2, *) else {
                return promise.resolve(
                    TokenResult(
                        success: Field(wrappedValue: false),
                        errorMessage: Field(wrappedValue: "Requires iOS 17.2 or newer")
                    )
                )
            }

            Task {
                do {
                    for await data in Activity<WidgetAttributes>.pushToStartTokenUpdates {
                        let token = data.map { String(format: "%02x", $0) }.joined()

                        return promise.resolve(
                            TokenResult(
                                token: Field(wrappedValue: token),
                                success: Field(wrappedValue: true)
                            )
                        )
                    }

                    promise.resolve(
                        TokenResult(
                            success: Field(wrappedValue: false),
                            errorMessage: Field(wrappedValue: "No token received")
                        )
                    )
                }
            }
        }
    }
}
