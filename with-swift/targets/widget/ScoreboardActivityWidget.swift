import ActivityKit
import WidgetKit
import SwiftUI

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

struct ScoreboardActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: WidgetAttributes.self) { context in
            HStack {
                HStack {
                    Image("home", bundle: .main)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 30, height: 30)
                    VStack(alignment: .leading) {
                        Text(context.attributes.homeTeam)
                        Text("\(context.state.homeScore)")
                            .font(.headline)
                    }
                }
                Spacer()
                Text("\(context.state.timeRemaining)")
                Spacer()
                HStack {
                    VStack(alignment: .trailing) {
                        Text(context.attributes.awayTeam)
                        Text("\(context.state.awayScore)")
                            .font(.headline)
                    }
                    Image("away", bundle: .main)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 30, height: 30)
                }
            }
            .padding()
            .activityBackgroundTint(Color.black)
            .foregroundColor(Color.white)

        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .leading) {
                        Image("home", bundle: .main)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 40, height: 40)
                        Text(context.attributes.homeTeam)
                            .font(.caption)
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing) {
                        Image("away", bundle: .main)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 40, height: 40)
                        Text(context.attributes.awayTeam)
                            .font(.caption)
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    HStack {
                        Text("\(context.state.homeScore)")
                            .font(.title2)
                        Spacer()
                        Text("Q\(context.state.currentQuarter) \(context.state.timeRemaining)")
                        Spacer()
                        Text("\(context.state.awayScore)")
                            .font(.title2)
                    }
                }
            } compactLeading: {
                HStack(spacing: 4) {
                    Image("home", bundle: .main)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 16, height: 16)
                    Text("\(context.state.homeScore)")
                }
            } compactTrailing: {
                HStack(spacing: 4) {
                    Text("\(context.state.awayScore)")
                    Image("away", bundle: .main)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 16, height: 16)
                }
            } minimal: {
                Image("home", bundle: .main)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 20, height: 20)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}